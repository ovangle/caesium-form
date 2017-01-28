import moment = require('moment');
import {Moment} from 'moment';

import {
    Component, Input, Output, EventEmitter,
    ChangeDetectionStrategy
} from '@angular/core';

import {ValueError} from 'caesium-core/exception';

import {DatePickerState} from './date-picker';

@Component({
    selector: 'cs-date-picker-nav',
    moduleId: typeof module.id === "string" ? module.id : null,
    template: `
    <button 
        *ngIf="pickerState === 'day'"
        class="btn btn-sm btn-outline-primary month-decr"
        (click)="decrementMonth()">
        <cs-icon name="caret-left"></cs-icon>
    </button>
    
    <div class="display-month-container">
        <button class="btn btn-sm picker-state-toggle"
            [ngClass]="{
                'btn-outline-primary': pickerState === 'day',
                'btn-primary': pickerState === 'month'
            }"
            (click)="togglePickerState()">
            {{_moment.format('MMMM YYYY')}}
        </button>
    </div>
    
    <button 
        *ngIf="pickerState === 'day'"
        class="btn btn-sm btn-outline-primary month-incr"
        (click)="incrementMonth()">
        
        <cs-icon name="caret-right"></cs-icon>
    </button>
    `,
    styleUrls: ['nav.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsDatePickerNav {

    @Input() displayMonth: {year: number, month: number};
    @Output() displayMonthChange = new EventEmitter<{year: number, month: number}>();

    @Input() pickerState: DatePickerState;
    @Output() pickerStateChange = new EventEmitter<DatePickerState>();

    get _moment(): Moment {
        return moment.utc(this.displayMonth);
    }

    get _displayMonthName(): string {
        return moment.months(this.displayMonth.month);
    }

    togglePickerState() {
        let newPickerState: DatePickerState;
        if (this.pickerState === 'day') {
            newPickerState = 'month';
        } else if (this.pickerState === 'month') {
            newPickerState = 'day';
        } else {
            throw new ValueError(`Invalid picker state: '${this.pickerState}`);
        }
        this.pickerStateChange.emit(newPickerState);
    }

    decrementMonth() {
        let m = this._moment.subtract({month: 1});
        this.displayMonthChange.emit({year: m.year(), month: m.month()});
    }

    incrementMonth() {
        let m = this._moment.add({month: 1});
        this.displayMonthChange.emit({year: m.year(), month: m.month()});
    }
}
