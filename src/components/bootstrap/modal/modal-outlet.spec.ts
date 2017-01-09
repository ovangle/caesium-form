import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/do';

import {Component, Directive, ViewChild, TemplateRef, DebugElement} from '@angular/core';
import {async, inject, TestBed, ComponentFixture} from '@angular/core/testing';

import {By} from '@angular/platform-browser';

import {CsModals, CsModalOptions} from './modals';
import {CsModalOutlet, ModalOutletDisplayState} from './modal-outlet';

class MockModalService {
    outlet: CsModalOutlet;

    registerOutlet(outlet: CsModalOutlet) {
        this.outlet = outlet;
    }
}

@Directive({
    selector: 'template[csModalTemplate]',
})
export class ModalTemplate {
    constructor(
        public templateRef: TemplateRef<any>
    ) {}
}

@Component({
    selector: 'cs-modal-outlet-host',
    template: `
    <cs-modal-outlet></cs-modal-outlet>
    
    <template csModalTemplate #content>
        <div class="modal-header">
            <h4>Header</h4> 
        </div>
        <div class="modal-body">
            Body 
        </div>
        <div class="modal-footer">
            Footer 
        </div>
    </template>
    `
})
class ModalOutletHost {
    @ViewChild('content', {read: TemplateRef})
    modalContent: TemplateRef<any>;
}

describe('components.bootstrap.modal.modal-outlet', () => {
    describe('ModalOutlet', () => {
        let fixture: ComponentFixture<ModalOutletHost>;
        let outlet: DebugElement;
        let template: TemplateRef<any>;

        async function withOpenModal(options: CsModalOptions, test: () => Promise<any>): Promise<any> {
            fixture.detectChanges();
            let outletComponent: CsModalOutlet = outlet.componentInstance;
            await outletComponent.display(template, options);
            fixture.detectChanges();
            if (outletComponent.isTransitioning)
                await outletComponent.nextTransitionEnd();
            await test();
            await outletComponent.dismiss({type: 'template'});
        }

        beforeEach(async(async () => {
            TestBed.configureTestingModule({
                declarations: [
                    CsModalOutlet,
                    ModalTemplate,
                    ModalOutletHost
                ],
                providers: [
                    {provide: CsModals, useClass: MockModalService}
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(ModalOutletHost);
            outlet = fixture.debugElement.query(By.directive(CsModalOutlet));
            template = fixture.componentInstance.modalContent;
        }));

        it('should register the outlet on init', inject(
            [CsModals],
            (service: MockModalService) => {
                fixture.detectChanges();
                expect(service.outlet).toBe(outlet.componentInstance);
            })
        );

        it('should be able to set the content of the modal', () => {
            fixture.detectChanges();
            let outletComponent: CsModalOutlet = outlet.componentInstance;
            expect(outletComponent.hasContent).toBe(false);

            outletComponent.setContent(template, {keyboard: true});
            fixture.detectChanges();

            expect(outletComponent.hasContent).toBe(true);

            outletComponent.clearContent();
            fixture.detectChanges();
            expect(outletComponent.hasContent).toBe(false);
        });

        it('should be able to show and hide the modal', async (done) => {
            let component = outlet.componentInstance;
            let outletComponent: CsModalOutlet = outlet.componentInstance;
            outletComponent.setContent(template);
            fixture.detectChanges();

            // The first stage should set the content,
            // but not display the view
            expect(outletComponent.isShown).toBe(false, 'should not be displayed after setting content');
            expect(outletComponent.isTransitioning).toBe(false, 'setContent should not initiate a transition');

            // The modal should exist in the view, but still be hidden
            let modal = outlet.nativeElement.shadowRoot.querySelector('.modal');
            expect(modal).not.toBeNull();
            expect(modal.classList).not.toContain('in', 'Should not apply the \'in\' class');
            expect(modal.classList).not.toContain('active', 'Should not apply the \'active\' class');

            expect(document.body.classList).not.toContain('modal-open');

            await new Promise(requestAnimationFrame);
            await outletComponent.show();
            fixture.detectChanges();

            // The next stage should apply the 'in' and 'active' classes to the modal,
            // and apply the 'modal-open' class to the document body

            expect(outletComponent.isShown).toBe(true);
            expect(outletComponent.isTransitioning).toBe(true);

            modal = outlet.nativeElement.shadowRoot.querySelector('.modal');
            expect(modal.classList).toContain('in', 'Should apply the \'in\' class');
            expect(modal.classList).toContain('active', 'Should apply the \'active\' class');

            expect(document.body.classList).toContain('modal-open', 'Should apply the \'modal-open\' class to document.body');

            await outletComponent.nextTransitionEnd();

            expect(outletComponent.isTransitioning).toBe(false, 'wait for show transition to end');

            await outletComponent.hide();
            fixture.detectChanges();

            expect(outletComponent.isShown).toBe(false);
            expect(outletComponent.isTransitioning).toBe(true);

            modal = outlet.nativeElement.shadowRoot.querySelector('.modal');
            expect(modal.classList).not.toContain('in', 'Should unapply the \'in\' class');
            expect(modal.classList).not.toContain('active', 'Should unapply the \'active\' class');

            expect(document.body.classList)
                .not.toContain('modal-open', 'Should unapply the \'modal-open\' on document.body');

            await outletComponent.clearContent();
            fixture.detectChanges();
            expect(outletComponent.isShown).toBe(false, 'should be hidden after clearing the content');
            expect(outletComponent.isTransitioning).toBe(false, 'wait for hide transition to end to begin transition');

            done();
        });

        it('should emit stateChange events during the show/hide process', async (done) => {
            let comp = outlet.componentInstance as CsModalOutlet;

            let allEvents: ModalOutletDisplayState[] = [];
            comp.displayStateChange
                .scan((acc, modalState) => [...acc, modalState], <ModalOutletDisplayState[]>[])
                .subscribe(seenEvents => {
                    allEvents = seenEvents;
                });

            // Open and close the modal
            await withOpenModal({}, () => null);

            expect(allEvents)
                .toEqual(['showing', 'shown', 'hiding', 'hidden']);

            done();
        });

        //TODO: Need to fix the test.
        xit('when showing, it should focus the modal if the `focus` option is set', async (done) => {
            await withOpenModal({focus: true}, async () => {
                let activeElement = outlet.nativeElement.shadowRoot.querySelector('div.modal');

                document.addEventListener('focus', (evt) => {
                    console.log('Focus event fired');
                });

                expect(document.activeElement).toBe(outlet.nativeElement);
                expect(outlet.nativeElement.shadowRoot.activeElement).toBe(activeElement);
            });
            await withOpenModal({focus: false}, async () => {
                document.addEventListener('focus', (evt) => {
                    console.log('Focus event fired (2)');
                });
                expect(document.activeElement).toEqual(document.body);
            });
            done();
        });

        it('if keyboard is set, should dismiss the modal on "Esc" keyup', async (done) => {
            await withOpenModal({keyboard: true}, async() => {
                let outletComponent: CsModalOutlet = outlet.componentInstance;
                let reason$ = outletComponent.dismissEvent.first().toPromise();

                outlet.triggerEventHandler('keyup', {key: 'Escape'});
                fixture.detectChanges();

                try {
                    let reason = await reason$;
                    await outletComponent.nextTransitionEnd();
                    expect(outletComponent.isShown).toBe(false, 'should dismiss the modal');
                    expect(reason).toEqual({type: 'keyboard', content: template});
                } catch (e) {
                    fail('did not dismiss the modal, caught:' + e.toString());
                }
            });

            await withOpenModal({keyboard: false}, async () => {
                let outletComponent: CsModalOutlet = outlet.componentInstance;
                let reason$ = outletComponent.dismissEvent.timeout(200).first().toPromise();

                outlet.triggerEventHandler('keyup', {key: 'Space'});
                fixture.detectChanges();

                try {
                    await reason$;
                    fail('should not have dismissed the modal');
                } catch (e) {
                    expect(e.message).toBe('timeout');
                }
            });
            await new Promise(window.setTimeout);
            done();
        }, 2000);

        it('if options.backdrop is set, should dismiss the modal when clicking on the backdrop', async (done) => {
            let t1 = new Date().valueOf();
            let outletComponent: CsModalOutlet = outlet.componentInstance;

            await withOpenModal({backdrop: true}, async() => {
                let reason$ = outletComponent.dismissEvent.first().toPromise();
                outlet.triggerEventHandler('click', {path: []});
                fixture.detectChanges();
                try {
                    let reason = await reason$;
                    expect(reason).toEqual({type: 'backdrop', content: template});
                } catch (e) {
                    fail('did not dismiss the modal, caught:\n' + e.toString());
                }
            });

            await withOpenModal({backdrop: true}, async() => {
                let modalContainer = outlet.nativeElement.shadowRoot.querySelector('.modal');

                let reason$ = outletComponent.dismissEvent.timeout(50).first().toPromise();
                outlet.triggerEventHandler('click', {path: [modalContainer]});
                fixture.detectChanges();
                try {
                    await reason$;
                    fail('should not have dismissed the modal, click inside');
                } catch (e) {
                    expect(e.message).toBe('timeout');
                }
            });

            await withOpenModal({backdrop: false}, async() => {
                let reason$ = outletComponent.dismissEvent.do((evt) => {
                    console.log('dismissed', evt);
                }).timeout(50).first().toPromise();
                outlet.triggerEventHandler('click', {path: []});
                fixture.detectChanges();
                try {
                    await reason$;
                    fail('should not have dismissed the modal, options.backdrop is false');
                } catch (e) {
                    console.log('caught: ', e);
                    expect(e.message).toBe('timeout');
                }
            });
            let t2 = new Date().valueOf();
            console.log('elapsed: ', t2 - t1);

            done();
        }, 2000);
    });
});

