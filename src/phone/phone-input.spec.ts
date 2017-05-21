import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

import {Component, Input, ViewChild, DebugElement} from '@angular/core';

import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule, NgControl} from '@angular/forms';

import {CsMaskedInputModule} from '../masked-input/module';
import {CsIconModule} from '../icon/module';

import {CsPhoneInput, CsMobilePhoneInput} from './phone-input';

@Component({
    selector: 'cs-phone-input-test',
    template: `
        <cs-phone-input #phone [(ngModel)]="phone"></cs-phone-input>
        <cs-mobile-phone-input #mobilePhone [(ngModel)]="mobile"></cs-mobile-phone-input>
    `
})
export class CsPhoneInputTest {
    phone: string = '';
    mobile: string = '';

    @ViewChild('phone', {read: NgControl}) phoneControl: NgControl;
    @ViewChild('mobilePhone', {read: NgControl}) mobilePhoneControl: NgControl;
}

describe('components.phone.phone-input', () => {
        let fixture: ComponentFixture<CsPhoneInputTest>;
        let phoneInputElement: DebugElement;
        let mobilePhoneInputElement: DebugElement;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                imports: [
                    ReactiveFormsModule,
                    CsMaskedInputModule,
                    CsIconModule
                ],
                declarations: [
                    CsPhoneInput,
                    CsMobilePhoneInput,
                    CsPhoneInputTest
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(CsPhoneInputTest);
            phoneInputElement = fixture.debugElement.query(By.directive(CsPhoneInput));
            mobilePhoneInputElement = fixture.debugElement.query(By.directive(CsMobilePhoneInput));

            done();
        });


        it('cs-phone-input respond to changes in input', () => {
            fixture.detectChanges();

            let input = phoneInputElement.query(By.css('input[type=tel]'));

            input.nativeElement.value = '(02) 1234 5678';
            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.phone).toEqual('021235678');

            fixture.componentInstance.phone = '0287654321';
            fixture.detectChanges();

            expect(input.nativeElement.value).toEqual('(02) 8765 4321');
        });

        it('cs-phone-input should provide validation of the mask', () => {
            fixture.detectChanges();
            fixture.componentInstance.phone = '012345';
            fixture.detectChanges();
            expect(fixture.componentInstance.phoneControl.errors).toEqual({mismatch: true});
        })


    it('cs-mobile-phone-input respond to changes in input', () => {
        fixture.detectChanges();

        let input = phoneInputElement.query(By.css('input[type=tel]'));

        input.nativeElement.value = '(02) 1234 5678';
        input.triggerEventHandler('input', {target: input.nativeElement});
        fixture.detectChanges();

        expect(fixture.componentInstance.phone).toEqual('021235678');

        fixture.componentInstance.phone = '0287654321';
        fixture.detectChanges();

        expect(input.nativeElement.value).toEqual('(02) 8765 4321');
    });

    it('cs-phone-input should provide validation of the mask', () => {
        fixture.detectChanges();
        fixture.componentInstance.phone = '012345';
        fixture.detectChanges();
        expect(fixture.componentInstance.phoneControl.errors).toEqual({mismatch: true});
    });
});


