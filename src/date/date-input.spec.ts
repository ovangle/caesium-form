import * as moment from 'moment';
import {Component, Input, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CsBootstrapModule} from '../bootstrap/module';
import {CsIconModule} from '../icon/module';

import {CsDatePicker, CsDatePickerModule} from './picker/module';
import {CsDateInput, CsDateInputValueAccessor} from './date-input';


describe('components.date.date-input', () => {
    describe('CsDateInput', () => {
        @Component({
            selector: 'cs-date-input-host',
            template: `
            <cs-date-input
                #dateInput
                [date]="date" (dateChange)="date = $event"
                [disabled]="disabled"
                [required]="required">
            </cs-date-input>    
            `
        })
        class CsDateInputHost {
            @ViewChild(CsDateInput) dateInput: CsDateInput;


            @Input() date: Date;
            @Input() required: boolean = false;
            @Input() disabled: boolean = false;
        }

        let fixture: ComponentFixture<CsDateInputHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    CsIconModule,
                    CsBootstrapModule,
                    CsDatePickerModule
                ],
                declarations: [
                    CsDateInput,
                    CsDateInputHost
                ]
            });

            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsDateInputHost);

            done();
        });

        it('should be possible to open/close the date picker', () => {
            fixture.detectChanges();

            let datePickerToggle = fixture.debugElement.query(By.css('.dropdown-trigger button'));
            datePickerToggle.triggerEventHandler('click', {});
            fixture.detectChanges();

            let datePicker = fixture.debugElement.query(By.directive(CsDatePicker));
            expect(datePicker).not.toBeNull('Should display the date picker');

            datePickerToggle.triggerEventHandler('click', {});
            fixture.detectChanges();

            datePicker = fixture.debugElement.query(By.directive(CsDatePicker));
            expect(datePicker).toBeNull('Should hide the date picker');
        });

        it('should be possible to input a date via the picker', () => {
            fixture.detectChanges();

            let datePickerToggle = fixture.debugElement.query(By.css('.dropdown-trigger button'));
            datePickerToggle.triggerEventHandler('click', {});
            fixture.detectChanges();

            let datePicker = fixture.debugElement.query(By.directive(CsDatePicker));
            datePicker.triggerEventHandler('dateChange', moment.utc({year: 1956, month: 7, day: 1}));
            fixture.detectChanges();

            let input = fixture.debugElement.query(By.css('input'));

            expect(fixture.componentInstance.date.toISOString())
                .toEqual('1956-08-01T00:00:00.000Z');

        });

        it('should parse the input set in the text field', () => {
            fixture.detectChanges();
            let input = fixture.debugElement.query(By.css('input'));

            input.nativeElement.value = '01/07/2936';

            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.date).not.toBeUndefined();
            expect(fixture.componentInstance.date.toISOString())
                .toEqual('2936-07-01T00:00:00.000Z');

            input.nativeElement.value = '';
            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.date).toBeNull('An empty input value corresponds to a null date');
        });

        it('should error on an invalid date', () => {
            fixture.detectChanges();
            let input = fixture.debugElement.query(By.css('input'));
            input.nativeElement.value = '04/';

            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.date).toBeUndefined();
            expect(fixture.componentInstance.dateInput.errors).toEqual({invalidDate: true});

            input.nativeElement.value = '04/08/2014';
            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();
            expect(fixture.componentInstance.dateInput.errors).toBeNull();
        });

        it('should error on null or undefined if `required` is set', () => {
            fixture.componentInstance.required = true;
            fixture.detectChanges();

            expect(fixture.componentInstance.dateInput.errors)
                .toEqual({required: true});

            let input = fixture.debugElement.query(By.css('input'));
            input.nativeElement.value = '01/01/1901';
            input.triggerEventHandler('input', {target: input.nativeElement});
            fixture.detectChanges();

            expect(fixture.componentInstance.dateInput.errors).toBeNull();

            fixture.componentInstance.required = false;
            fixture.componentInstance.date = null;
            fixture.detectChanges();

            expect(fixture.componentInstance.dateInput.errors)
                .not.toBeNull('An unrequired null input should not error');
        });
    });

    describe('CsDateInputControlValueAccessor', () => {
        @Component({
            selector: 'cs-date-input-host',
            template: `
            <cs-date-input [(ngModel)]="ngModel"></cs-date-input>
            `
        })
        class CsDateInputHost {
            @Input() ngModel: Date;
        }

        let fixture: ComponentFixture<CsDateInputHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    CsIconModule,
                    CsBootstrapModule,
                    CsDatePickerModule
                ],
                declarations: [
                    CsDateInput,
                    CsDateInputValueAccessor,
                    CsDateInputHost
                ]
            });

            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsDateInputHost);

            done();
        });

        it('should be possible to get/set the input value via the ngModel api', async (done) => {
            fixture.detectChanges();
            let now = moment.utc({year: 1976, month: 2, day: 7}).toDate();
            fixture.componentInstance.ngModel = now;

            fixture.detectChanges();
            await fixture.whenStable();


            let dateInput = fixture.debugElement.query(By.directive(CsDateInput));
            expect(dateInput.componentInstance.date).toEqual(now, 'should reflect the input value');

            let now2 = moment.utc({year: 1945, month: 5, day: 2}).toDate();
            dateInput.componentInstance.dateChange.emit(now2);
            fixture.detectChanges();
            expect(fixture.componentInstance.ngModel).toEqual(now2, 'should respond to change events');

            done();
        });
    });
});

