import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/first';

import {List} from 'immutable';

import {
    Component, Input, Output, EventEmitter,
    DebugElement
} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';

import {isBlank} from 'caesium-core/lang';

import {CsToggle, CsToggleOption, CsToggleActive, CsSimpleToggleOption} from './toggle';

@Component({
    selector: 'cs-toggle-host',
    template: `
    <nav class="nav nav-inline" (csToggle)="onActiveChange($event)">
        <a csToggleOption="OPTION_A" class="nav-link" href="#" [active]="true">Option A</a>
        <a csToggleOption="OPTION_B" class="nav-link" href="#">Option B</a>
        <a csToggleOption="OPTION_C" class="nav-link" href="#" [disabled]="true">Option C</a>
        <button csToggleOption="BUTTON_OPTION" class="nav-link btn btn-primary">Button</button>
    </nav>
    
    <div id="toggle-content" [ngSwitch]="activeChange | async">
        <div *ngSwitchCase="'OPTION_A'">Option A content</div>
        <div *ngSwitchCase="'OPTION_B'">Option B content</div>
        <div *ngSwitchCase="'OPTION_C'">Option C content</div>
        <div *ngSwitchCase="'BUTTON_OPTION'">Button content</div>
        <div *ngSwitchDefault>
            No content
        </div>     
    </div>
    `
})
export class CsToggleHost {
    @Output() activeChange = new EventEmitter<string>();

    onActiveChange(active: string) {
        this.activeChange.emit(active);
    }
}

@Component({
    selector: 'cs-toggle-active-host',
    template: `
    <div (csToggle)="activeChange.emit($event)">
        <button [csToggleActive]="true" class="btn btn-secondary">ON/OFF</button> 
    </div>
    
    <div *ngIf="activeChange | async" id="toggle-content">
        Toggled content
    </div>
    `
})
export class CsToggleActiveHost {
    @Output() activeChange = new EventEmitter<boolean>();
}

describe('components.toggle', () => {
    describe('CsToggle', () => {

        let fixture: ComponentFixture<CsToggleHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [CommonModule],
                declarations: [
                    CsToggle,
                    CsSimpleToggleOption,
                    CsToggleHost
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsToggleHost);
            done();
        });

        function activateOption(value: string): DebugElement {
            let options = List(fixture.debugElement.queryAll(By.directive(CsSimpleToggleOption)))
                .map(elem => [elem, elem.injector.get(CsSimpleToggleOption)]);

            let option = options
                .filter(option => option[1].value === value)
                .first();

            if (isBlank(option)) {
                throw `No option found with value '${value}'`;
            }

            let optionElem = option[0];
            optionElem.triggerEventHandler('click', {});
            return optionElem;
        }

        it('should switch between the options on click', () => {
            let states: string[] = [];

            fixture.componentInstance.activeChange.forEach(state => {
                states.push(state);
            });
            fixture.detectChanges();

            activateOption('OPTION_A');
            activateOption('OPTION_B');
            activateOption('BUTTON_OPTION');

            expect(states).toEqual(['OPTION_A', 'OPTION_A', 'OPTION_B', 'BUTTON_OPTION']);
        });

        it('should not emit an event when clicking on a disabled item', async (done) => {
            fixture.detectChanges();
            let activeState$ = fixture.componentInstance.activeChange.first().timeout(200).toPromise();
            activateOption('OPTION_C');

            try {
                let activeState = await activeState$;
                fail('A disabled element should not emit an active state');
            } catch (e) {
                expect(e.message).toBe('timeout');
            }
            done();

        });

        it('should toggle the content', async (done) => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            let content = fixture.debugElement.query(By.css('#toggle-content'));
            expect(content.nativeElement.innerHTML)
                .toContain('Option A content', 'Option A should be the initial activate value');

            activateOption('OPTION_B');
            fixture.detectChanges();
            expect(content.nativeElement.innerHTML)
                .toContain('Option B content', 'Option B should be activated');
            done();
        });
    });

    describe('CsToggleActive', () => {
        let fixture: ComponentFixture<CsToggleActiveHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [CommonModule],
                declarations: [
                    CsToggle,
                    CsToggleActive,
                    CsToggleActiveHost
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsToggleActiveHost);
            done();
        });

        function activate(): DebugElement {
            let button = fixture.debugElement.query(By.directive(CsToggleActive));
            button.triggerEventHandler('click', {});
            return button
        }

        it('should toggle the content', async (done) => {
            fixture.detectChanges();

            await fixture.whenStable();
            fixture.detectChanges();

            let content = fixture.debugElement.query(By.css('#toggle-content'));
            expect(content.nativeElement.innerHTML)
                .toContain('Toggled content', 'Should be initially active');

            activate();
            fixture.detectChanges();
            content = fixture.debugElement.query(By.css('#toggle-content'));
            expect(content).toBeNull('Should remove the content');

            activate();
            fixture.detectChanges();
            content = fixture.debugElement.query(By.css('#toggle-content'));
            expect(content.nativeElement.innerHTML)
                .toContain('Toggled content', 'Should restore the content');

            done();
        });
    });
});
