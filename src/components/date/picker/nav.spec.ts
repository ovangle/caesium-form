import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CsIconModule} from '../../icon/module';

import {DatePickerState} from './date-picker';
import {CsDatePickerNav} from './nav';

@Component({
    selector: 'cs-date-picker-nav-host',
    template: `
    <cs-date-picker-nav
        [pickerState]="pickerState" (pickerStateChange)="pickerState = $event"
        [displayMonth]="displayMonth" (displayMonthChange)="displayMonth = $event">
    </cs-date-picker-nav>    
    `

})
export class CsDatePickerNavHost {
    @Input() pickerState: DatePickerState;
    @Input() displayMonth: {year: number, month: number};
}

describe('components.date.picker.nav', () => {
    describe('CsDatePickerDisplayNav', () => {
        let fixture: ComponentFixture<CsDatePickerNavHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    CsIconModule
                ],
                declarations: [
                    CsDatePickerNav,
                    CsDatePickerNavHost
                ]
            });

            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsDatePickerNavHost);
            done();
        });

        it('should decrement the month when the left caret button is clicked', () => {
            fixture.componentInstance.pickerState = 'day';
            fixture.componentInstance.displayMonth = {year: 1912, month: 11};
            fixture.detectChanges();

            let button = fixture.debugElement.query(By.css('button.month-decr'));
            button.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(fixture.componentInstance.displayMonth).toEqual({year: 1912, month: 10});
        });

        it('should increment the month when the right caret button is clicked', () => {
            fixture.componentInstance.pickerState = 'day';
            fixture.componentInstance.displayMonth = {year: 1912, month: 11};
            fixture.detectChanges();
            let button = fixture.debugElement.query(By.css('button.month-incr'));
            button.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(fixture.componentInstance.displayMonth).toEqual({year: 1913, month: 0});
        });

        it('should hide the left and right caret buttons when the picker state is \'month\'', () => {
            fixture.componentInstance.pickerState = 'day';
            fixture.componentInstance.displayMonth = {year: 1945, month: 7};
            fixture.detectChanges();

            expect(fixture.debugElement.query(By.css('button.month-incr'))).not.toBeNull('Should display increment button');
            expect(fixture.debugElement.query(By.css('button.month-decr'))).not.toBeNull('should display decrement button');

            fixture.componentInstance.pickerState = 'month';
            fixture.detectChanges();
            expect(fixture.debugElement.query(By.css('button.month-incr'))).toBeNull('Should hide increment button');
            expect(fixture.debugElement.query(By.css('button.month-decr'))).toBeNull('Should hide decrement button');

        });

        it('should toggle the picker state when the month is clicked', () => {
            fixture.componentInstance.pickerState = 'day';
            fixture.componentInstance.displayMonth = {year: 1945, month: 1};
            fixture.detectChanges();

            let button = fixture.debugElement.query(By.css('.picker-state-toggle'));
            button.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(fixture.componentInstance.pickerState).toEqual('month');

            button.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(fixture.componentInstance.pickerState).toEqual('day');

        });

        it('display text of the picker state button should match the display month', () => {
            fixture.componentInstance.pickerState = 'day';
            fixture.componentInstance.displayMonth = {year: 1934, month: 4};
            fixture.detectChanges();

            let button = fixture.debugElement.query(By.css('button.picker-state-toggle'));
            expect(button.nativeElement.textContent)
                .toContain('May 1934');

            fixture.componentInstance.displayMonth = {year: 2013, month: 7};
            button = fixture.debugElement.query(By.css('button.picker-state-toggle'));
            fixture.detectChanges();

            expect(button.nativeElement.textContent)
                .toContain('August 2013');



        });


    });
});

