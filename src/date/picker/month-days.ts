import moment = require('moment');
import {Moment} from 'moment';

import {
    Component, Input, Output, EventEmitter,
    ChangeDetectionStrategy,
}from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'cs-date-picker-month-days',
    template: `
    <table> 
        <thead>
            <tr><th *ngFor="let day of _weekDays">{{day}}</th></tr>
        </thead>
        <tbody>
            <tr *ngFor="let week of _monthWeeks">
                <td *ngFor="let day of week"
                    class="rounded"
                    [ngClass]="{
                        'in-display-month': inDisplayMonth(day),
                        'selected': isSelected(day)
                    }"
                    (click)="select(day)">
                    {{day.date()}}
                </td>
            </tr>
        </tbody>
    </table>
    `,
    styleUrls: ['month-days.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsDatePickerMonthDays {
    private _weekDays = moment.weekdaysShort();

    @Input() displayMonth: {year: number, month: number};

    /**
     * The date day of the displayMonth.
     * Does not necessarily have to be in the displayYear or displayMonth that is displayed
     */
    @Input() date: Moment;
    @Output() dateChange = new EventEmitter<Moment>();

    /**
     * Returns a 7x6 matrix containing the days of the calendar displayMonth.
     *
     * @returns {any[]}
     * A matrix, m_ij where `m_ij[i][j]` is the `(7*i + j)`th day of the calendar displayMonth.
     * The first day of the calendar displayMonth is either the Sunday or Monday directly before
     * the first of the displayMonth, depending on the locale.
     * @private
     */
    get _monthWeeks(): Moment[][] {
        // Start at the start of the week before the first day of the month.
        let currentDay = moment.utc(this.displayMonth)
            .date(0)
            .weekday(0);

        let monthWeeks = new Array(6);
        for (let i=0;i<6;i++) {
            let week = new Array(7);
            for (let i=0; i<7;i++) {
                week[i] = currentDay;
                currentDay = currentDay.clone().add({day: 1});
            }
            monthWeeks[i] = week;
        }
        return monthWeeks;
    }

    inDisplayMonth(day: Moment) {
        return day.year() === this.displayMonth.year
            && day.month() === this.displayMonth.month;
    }

    select(day: Moment) {
        this.dateChange.emit(day);
    }

    isSelected(day: Moment) {
        return day.isSame(this.date, 'day');
    }
}
