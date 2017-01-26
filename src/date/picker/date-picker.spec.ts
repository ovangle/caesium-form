import moment = require('moment');
import {Moment} from 'moment';

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CsBootstrapModule} from '../../bootstrap/module';
import {CsToggleModule} from '../../toggle/module';
import {CsIconModule} from '../../icon/module';

import {CsDatePickerMonthDays} from './month-days';
import {CsDatePickerMonthSelect} from './month-select';
import {CsDatePickerNav} from './nav';
import {CsDatePicker} from './date-picker';

@Component({
    selector: 'cs-date-picker-host',
    template: `
    <cs-date-picker [date]="date" (dateChange)="date = $event"></cs-date-picker>
    `
})
export class CsDatePickerHost {
    @Input() date: Moment;
    @Output() dateChange = new EventEmitter<Moment>();
}

describe('components.date.date-picker', () => {
    describe('CsDatePicker', () => {
        let fixture: ComponentFixture<CsDatePickerHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    FormsModule,
                    CsBootstrapModule,
                    CsToggleModule,
                    CsIconModule
                ],
                declarations: [
                    CsDatePickerMonthDays,
                    CsDatePickerMonthSelect,
                    CsDatePickerNav,
                    CsDatePicker,
                    CsDatePickerHost
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsDatePickerHost);
            done();
        });

        it('should toggle the state via the nav', () => {
            fixture.componentInstance.date = moment.utc({year: 1956, month: 4, day: 12});
            fixture.detectChanges();

            // Should display the month days by default
            let monthDays = fixture.debugElement.query(By.directive(CsDatePickerMonthDays));
            expect(monthDays).not.toBeNull();
            expect(monthDays.componentInstance.date)
                .toEqual(fixture.componentInstance.date);

            let nav = fixture.debugElement.query(By.directive(CsDatePickerNav));
            nav.componentInstance.togglePickerState();
            fixture.detectChanges();

            let monthSelect = fixture.debugElement.query(By.directive(CsDatePickerMonthSelect));
            expect(monthSelect).not.toBeNull();
            expect(monthSelect.componentInstance.month).toEqual({year: 1956, month: 4});

        });
    })
});
