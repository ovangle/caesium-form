import moment = require('moment');
import {Moment} from 'moment';

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';

import {isBlank} from 'caesium-core/lang';

export type DatePickerState = 'day' | 'month';

@Component({
    selector: 'cs-date-picker',
    moduleId: typeof module.id === "string" ? module.id : null,
    template: `
    <div class="picker-content" [ngSwitch]="_pickerState">
        <cs-date-picker-nav 
            [displayMonth]="_displayMonth" (displayMonthChange)="_displayMonth = $event"
            [pickerState]="_pickerState" (pickerStateChange)="_pickerState = $event">
        </cs-date-picker-nav>
    
        <cs-date-picker-month-days *ngSwitchDefault
            [displayMonth]="_displayMonth"
            [date]="date"
            (dateChange)="dateChange.emit($event)">
        </cs-date-picker-month-days>
            
        <cs-date-picker-month-select *ngSwitchCase="'month'"    
            [month]="_displayMonth"
            (monthChange)="updateDisplay($event)">
        </cs-date-picker-month-select>
    </div>     
    `,
    styleUrls: ['date-picker.css']
})
export class CsDatePicker {
    private _pickerState: DatePickerState = 'day';
    private _displayMonth: {year: number, month: number};

    /**
     * The selected date of the picker
     */
    @Input('date') date: Moment;
    @Output() dateChange = new EventEmitter<Moment>();

    ngOnInit() {
        if (isBlank(this.date)) {
            this.date = moment.utc();
        }
        this._displayMonth = {year: this.date.year(), month: this.date.month()};
    }

    private updateDisplay(displayMonth: {year: number, month: number}) {
        this._displayMonth = Object.assign({}, displayMonth);
        this._pickerState = 'day';
    }
}

