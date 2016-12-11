import {
    Component, QueryList, Input, ViewChildren, DebugElement,
    ViewEncapsulation
} from '@angular/core';

import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {CsFormGroup, CsIfInputError} from './form-group';


@Component({
    moduleId: module.id,
    selector: 'test.ts-cs-form-group',
    template: `
    
    <div class="container">
        <cs-form-group id="normal-form-group" class="row">
            <label>Normal form group</label> 
            <input class="form-control" id="normal-input"
                type="text" [(ngModel)]="normal" 
                #control="ngModel">
        </cs-form-group>
        
        <cs-form-group id="static-form-group" class="row">
            <label>Static form group</label>
            <p class="form-control-static mb-0">Input value</p>
        </cs-form-group>
        
        <cs-form-group id="disabled-form-group" class="row">
            <label>Disabled form group</label> 
            <input id="disabled-input" type="text" 
                class="form-control"
                [(ngModel)]="disabled" disabled>
        </cs-form-group>
        
         <cs-form-group id="required-form-group" class="row">
            <label>Required form group</label> 
            <input id="required-input" type="text" 
                    class="form-control"
                    [(ngModel)]="required" required>
           
            <div class="form-control-feedback" *csIfInputError="'required'">A value is required</div>
        </cs-form-group>
        
        <cs-form-group id="input-group-form-group" class="row">
            <label>Input group form group</label> 
            <div class="input-group">
                <span class="input-group-addon">@</span>         
                <input type="text" id="input-group-input" class="form-control" [(ngModel)]="inputGroup">
            </div>
        </cs-form-group> 
    </div>
    `,
})
class FormGroupHost{
    @Input() normal = '';
    @Input() disabled = '';
    @Input() required = '';

    @ViewChildren(CsFormGroup) formGroups: QueryList<CsFormGroup>;
}

describe('components.bootstrap.form-group', () => {
    describe('CsFormGroup', () => {
        let fixture: ComponentFixture<FormGroupHost>,
            normalFormGroup: DebugElement,
            staticFormGroup: DebugElement,
            disabledFormGroup: DebugElement,
            requiredFormGroup: DebugElement,
            inputGroupFormGroup: DebugElement;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, FormsModule],
                declarations: [CsFormGroup, CsIfInputError, FormGroupHost]
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FormGroupHost);

            normalFormGroup = fixture.debugElement.query(By.css('#normal-form-group'));
            staticFormGroup = fixture.debugElement.query(By.css('#static-form-group'));
            disabledFormGroup = fixture.debugElement.query(By.css('#disabled-form-group'));
            requiredFormGroup = fixture.debugElement.query(By.css('#required-form-group'));
            inputGroupFormGroup = fixture.debugElement.query(By.css('#input-group-form-group'));
        });

        it('should be able to determine whether the view child is a static element', async(() => {
            fixture.detectChanges();

            expect(normalFormGroup.componentInstance.isStatic)
                .toBe(false, 'A component with an \'input\' child should not be static');

            expect(staticFormGroup.componentInstance.isStatic)
                .toBe(true, 'A component with a \'p\' child should be static');
        }));

        it('should display validation errors for the input', async(() => {
            fixture.detectChanges();

            let input = requiredFormGroup.query(By.css('#required-input'));

            input.nativeElement.value = '';
            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.required).toEqual('');
            expect(requiredFormGroup.componentInstance.validationErrors).toEqual({required: true});

            input.nativeElement.value = 'hello world';
            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.required).toEqual('hello world');
            expect(requiredFormGroup.componentInstance.validationErrors)
                .toEqual(null, 'the input should be valid');
        }));

        it('should handle inputs which are not direct children of the element', () => {
            fixture.detectChanges();

            expect(inputGroupFormGroup.componentInstance.isStatic).toBe(false, 'should not be static');
        });

        it('should display help text if a value is invalid', async(() => {
            fixture.detectChanges();

            let input = requiredFormGroup.query(By.css('#required-input'));

            input.nativeElement.value = '';
            input.triggerEventHandler('input', {target: input.nativeElement});

            fixture.detectChanges();
            fixture.whenStable().then((_) => {

                expect(requiredFormGroup.componentInstance.validationErrors)
                    .toEqual({required: true});

                let root: DocumentFragment = requiredFormGroup.nativeElement.shadowRoot;
                let helpBlock = root.querySelector('div.form-control-feedback')
                expect(helpBlock).not.toBeNull('Control feedback should be present');
                expect(helpBlock.textContent).toMatch('A value is required');
            });
        }));
    });


    describe('HelpBlock', () => {
        @Component({
            selector: 'help-block-host',
            template: `<div *csIfInputError="'errorKey'">Help text</div>`
        })
        class HelpBlockHost {
            @ViewChildren(CsIfInputError) helpBlocks: QueryList<CsIfInputError>;
        }

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [CsIfInputError, HelpBlockHost]
            }).compileComponents();
        }));

        let fixture: ComponentFixture<HelpBlockHost>;

        beforeEach(() => {
            fixture = TestBed.createComponent(HelpBlockHost);
        });

        it('should have a reference to all contained error blocks', () => {
            fixture.detectChanges();
            expect(fixture.componentInstance.helpBlocks.length)
                .toBe(1);
            expect(fixture.componentInstance.helpBlocks.first.errorKey).toEqual('errorKey');
        });


        it('should display help iff control has the specified error', () => {
            fixture.detectChanges();
            let helpBlock = fixture.componentInstance.helpBlocks.first;

            helpBlock.displayHelp(<any>{
                valid: false,
                errors: {errorKey: true}
            });

            fixture.detectChanges();
            expect(fixture.nativeElement.innerHTML).toMatch('Help text');

            helpBlock.displayHelp(<any>{
                valid: false,
                errors: {notTheErrorKey: true}
            });
            fixture.detectChanges();
            expect(fixture.nativeElement.innerHTML).not.toMatch('Help text');
        });
    });
});
