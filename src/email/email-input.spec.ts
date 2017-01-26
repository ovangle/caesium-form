import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

import {Component, Input, Output, DebugElement, ViewChild, EventEmitter} from '@angular/core';

import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {CsIconModule} from '../icon/module';
import {CsEmailInput, EmailInputControlValueAccessor} from './email-input';



describe('components.email.email-input', () => {
    describe('EmailInput', () => {
        let fixture: ComponentFixture<CsEmailInput>;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    CsIconModule
                ],
                declarations: [
                    CsEmailInput
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(CsEmailInput);
            done();
        });

        it('should be possible to input an email', async (done) => {
            let input = fixture.debugElement.query(By.css('input'));

            fixture.detectChanges();

            fixture.componentInstance.email = 'local@example.com';
            fixture.detectChanges();

            expect(input.nativeElement.value).toEqual('local@example.com');

            input.nativeElement.value = 'local2@example.com';

            let emailChange = fixture.componentInstance.emailChange.first().toPromise();
            input.triggerEventHandler('input', {
                target: input.nativeElement,
                value: 'local2@example.com'
            });
            fixture.detectChanges();
            let email = await emailChange;

            expect(email).toBe('local2@example.com');
            done();
        });

        // The validation provided is the validation of the HTML5 email input
        it('should provide basic syntax validation of an email address', () => {
            fixture.detectChanges();
            fixture.componentInstance.email = 'Abc.example.com';
            fixture.detectChanges();
            expect(fixture.componentInstance.isValid)
                .toBe(false);
            expect(fixture.componentInstance.errors)
                .toEqual({syntaxError: jasmine.any(String)});

            fixture.componentInstance.email = 'john@smith.com';
            fixture.detectChanges();

            expect(fixture.componentInstance.isValid)
                .toBe(true);
            expect(fixture.componentInstance.errors)
                .toBeNull();
        });

        it('should validate a required input', () => {
            fixture.componentInstance.required = true;
            fixture.detectChanges();
            expect(fixture.componentInstance.isValid).toBe(false);
            expect(fixture.componentInstance.errors)
                .toEqual({required: true});
        });
    });
    describe('EmailInputValueAccessor', () => {
        @Component({
            selector: 'email-input-host',
            template: `
                <cs-email-input [(ngModel)]="email" 
                    #control="ngModel" name="test-one">
                </cs-email-input>
            `
        })
        class EmailInputHost {
            @Input() email: string;
            @ViewChild('control') control: NgControl;
        }

        let fixture: ComponentFixture<EmailInputHost>;
        let emailInput: DebugElement;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    CsIconModule
                ],
                declarations: [
                    CsEmailInput,
                    EmailInputHost
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(EmailInputHost);
            emailInput = fixture.debugElement.query(By.directive(CsEmailInput));
            done();
        });

        it('should be usable with the ngModel API', async (done) => {
            fixture.detectChanges();
            fixture.componentInstance.email = 'gambling@localhost';
            fixture.detectChanges();
            await emailInput.componentInstance.emailChange.first().toPromise();

            expect(emailInput.componentInstance.email).toBe('gambling@localhost');

            let _emailInput = emailInput.query(By.css('input[type=email]'));
            _emailInput.triggerEventHandler('blur', {target: _emailInput.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.control.touched)
                .toBe(true);
            done();
        });
    });
});
