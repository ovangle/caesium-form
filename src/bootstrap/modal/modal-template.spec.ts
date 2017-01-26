
import {Component, EventEmitter, Output, ViewChild, getDebugNode, DebugElement} from '@angular/core';
import {TestBed, ComponentFixture, ComponentFixtureAutoDetect} from '@angular/core/testing';
import {CommonModule} from '@angular/common';

import {By} from '@angular/platform-browser';

import {CsModalDismissalReason, CsModals} from './modals';
import {CsModalOutlet} from './modal-outlet';
import {CsModalTemplate} from './modal-template';



@Component({
    selector: 'cs-modal-dialog-host',
    template: `
    <template csModal (dismiss)="dismiss.emit($event)"> 
        <div class="modal-header">
            <h4>Quitting DOTA 2</h4>
        </div>
        <div class="modal-body">Are you sure?</div>
        <div class="modal-footer">
            <button id='confirm-button' class="btn" (click)="confirm()">Yes</button>
            <button class="btn" (click)="cancel()">No</button>
        </div>
    </template>
    
    <cs-modal-outlet></cs-modal-outlet>
    `
})
export class ModalDialogHost {
    @ViewChild(CsModalTemplate) quitDialog: CsModalTemplate;

    @Output() result = new EventEmitter<boolean>();
    @Output() dismiss = new EventEmitter<CsModalDismissalReason>();

    constructor(private modals: CsModals) {}

    confirm() {
        this.result.emit(true);
    }

    cancel() {
        this.result.emit(false);
    }
}


describe('components.bootstrap.modal.modal-dialog', () => {
    describe('ModalDialog', () => {
        let fixture: ComponentFixture<ModalDialogHost>;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                imports: [CommonModule],
                declarations: [
                    CsModalTemplate,
                    CsModalOutlet,
                    ModalDialogHost
                ],
                providers: [CsModals]
            }).compileComponents();
            fixture = TestBed.createComponent(ModalDialogHost);
            done();
        });

        it('should display the modal when activated', async (done) => {
            fixture.detectChanges();
            let ref = await fixture.componentInstance.quitDialog.display();
            fixture.detectChanges();
            let outlet = fixture.debugElement.query(By.css('cs-modal-outlet'));
            expect(outlet.nativeElement.shadowRoot.querySelector('.modal-body'))
                .not.toBeNull();
            let body = outlet.nativeElement.shadowRoot.querySelector('.modal-body');
            expect(body.textContent).toEqual('Are you sure?');

            await ref.dismiss();
            fixture.detectChanges();
            done();

        });

        it('should bind to events from within the template', async (done) => {
            fixture.detectChanges();
            let ref = await fixture.componentInstance.quitDialog.display();
            fixture.detectChanges();

            let outlet = fixture.debugElement.query(By.directive(CsModalOutlet));
            let buttonElement: HTMLButtonElement = outlet.nativeElement.shadowRoot.querySelector('#confirm-button');
            let button = <DebugElement>getDebugNode(buttonElement);

            let result$ = fixture.componentInstance.result.first().toPromise();

            button.triggerEventHandler('click', {});
            fixture.detectChanges();

            let result = await result$;

            expect(result).toBe(true);
            await ref.dismiss();
            fixture.detectChanges();
            done();
        });


    });

});
