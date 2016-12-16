import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

import {Component, Input, ViewChild, DebugElement} from '@angular/core';

import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule, NgControl} from '@angular/forms';

import {isDefined} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';

import {PhoneNumber, PhoneLocalization, PhoneNumberType} from '../../models/phone_number';
import {CsIconModule} from '../icon/module';

import {CsPhoneInput} from './phone-input';

class MockPhoneLocalization {
    getFormat(phoneType?: PhoneNumberType): string {
        if (!isDefined(phoneType))
            return 'ddddddddddd';
        switch (phoneType) {
            case 'home':
                return '(dd) dddd dddd';
            case 'mobile':
                return 'dddd ddd ddd';
            default:
                throw new ArgumentError(`Invalid type for phone number: '${phoneType}'`);
        }
    }
}



describe('components.phone.phone-input', () => {
    describe('CsPhoneInput', () => {

        let fixture: ComponentFixture<CsPhoneInput>;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                imports: [FormsModule, ReactiveFormsModule, CsIconModule],
                declarations: [CsPhoneInput],
                providers: [
                    {provide: PhoneLocalization, useClass: MockPhoneLocalization}
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(CsPhoneInput);
            fixture.componentInstance.type = 'home';
            done();
        });



        it('should respond to changes in input', async (done) => {
            fixture.detectChanges();

            let input = fixture.debugElement.query(By.css('input[type=tel]'));
            let phoneChange = fixture.componentInstance.phoneChange.first().toPromise();

            input.nativeElement.value = '(02) 1234 5678';
            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            let phone = await phoneChange;
            expect(phone).toEqual('0212345678');

            fixture.componentInstance.phone = '0287654321';
            fixture.detectChanges();

            expect(input.nativeElement.value).toEqual('(02) 8765 4321');
            done();
        });

        it('should provide format validation of input', () => {
            fixture.detectChanges();

            fixture.componentInstance.phone = '02A';
            fixture.detectChanges();

            expect(fixture.componentInstance.isValid).toBe(false);
            expect(fixture.componentInstance.errors).toEqual({tooShort: true});
        });

        it('should reposition the caret to automatically insert format characters', () => {
            fixture.detectChanges();
            let input = fixture.debugElement.query(By.css('input[type=tel]'));
            input.nativeElement.value = '0';
            input.triggerEventHandler('keypress', {target: input.nativeElement});
            fixture.detectChanges();

            expect(input.nativeElement.value).toEqual('(0');
            expect(input.nativeElement.selectionStart).toEqual(2);
            expect(input.nativeElement.selectionEnd).toEqual(2);

            input.nativeElement.value = '(023';

            input.triggerEventHandler('keypress', {target: input.nativeElement});
            fixture.detectChanges();

            expect(input.nativeElement.value).toEqual('(02) 3');
            expect(input.nativeElement.selectionStart).toEqual(6);
            expect(input.nativeElement.selectionEnd).toEqual(6);
        });

        it('should format the input based on the \'type\'', () => {
            fixture.detectChanges();

            let input = fixture.debugElement.query(By.css('input[type=tel]'));
            input.nativeElement.value = '0241491231';
            input.triggerEventHandler('keypress', {target: input.nativeElement});

            expect(input.nativeElement.value).toEqual('(02) 4149 1231');

            fixture.componentInstance.type = 'mobile';
            fixture.detectChanges();
            expect(input.nativeElement.value).toEqual('0241 491 231');
        });
    });

    describe('PhoneInputValueAccessor', () => {
        @Component({
            selector: 'phone-input-host',
            template: `
                <cs-phone-input [(ngModel)]="phone" 
                    #control="ngModel" name="test-one">
                </cs-phone-input>
            `
        })
        class PhoneInputHost {
            @Input() phone: string;
            @ViewChild('control') control: NgControl;
        }

        let fixture: ComponentFixture<PhoneInputHost>;
        let phoneInput: DebugElement;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    CsIconModule
                ],
                declarations: [
                    CsPhoneInput,
                    PhoneInputHost
                ],
                providers: [
                    {provide: PhoneLocalization, useClass: MockPhoneLocalization}
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(PhoneInputHost);
            phoneInput = fixture.debugElement.query(By.directive(CsPhoneInput));
            phoneInput.componentInstance.type = 'home';
            done();
        });

        it('should be usable with the ngModel API', async (done) => {
            console.log(fixture.componentInstance.phone);
            fixture.detectChanges();
            fixture.componentInstance.phone = '1243211234';
            fixture.detectChanges();
            await phoneInput.componentInstance.phoneChange.first().toPromise();

            expect(phoneInput.componentInstance.phone).toBe('1243211234');

            let _emailInput = phoneInput.query(By.css('input[type=tel]'));
            _emailInput.triggerEventHandler('blur', {target: _emailInput.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.control.touched)
                .toBe(true);
            done();
        });
    });

});


