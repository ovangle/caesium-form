import {EventEmitter} from '@angular/core';

import {inject, TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';

import {ModalOutletException} from './modal-outlet';
import {CsModals} from './modals';

class MockOutlet {
    displayStateChange = new EventEmitter<any>();
    dismissEvent = new EventEmitter<any>();
}


describe('components.bootstrap.modal.modals', () => {
    describe('ModalService', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [CsModals]
            })
        });


        it('should be possible to register an outlet', inject(
            [CsModals],
            (modals: CsModals) => {
            let outlet = new MockOutlet();

            modals.registerOutlet(outlet as any);
            expect(modals.hasOutlet).toBe(true);

            expect(() => modals.registerOutlet(new MockOutlet() as any))
                .toThrow(jasmine.any(ModalOutletException));
            }
        ));
    });
});
