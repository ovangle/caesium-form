import moment = require('moment');
import {Moment} from 'moment';

import {List, Range} from 'immutable';

import {
    Component, Input, Output, EventEmitter,
    ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import {isBlank} from 'caesium-core/lang';

const ACCELERATION = 50;
const INIT_DELAY = 500;
const MAX_DELAY = 50;

function repeatWithAcceleration(callback: () => boolean) {
    return _repeatWithAcceleration(callback, 0);
}

function _repeatWithAcceleration(callback: () => boolean, count?: number): Promise<any> {
    count = !isBlank(count) ? count : 0;
    return new Promise((resolve, reject) => {
        let stop: boolean;
        try {
            stop = callback();
        } catch (e) {
            reject(e);
        }

        if (!stop) {
            window.setTimeout(
                () => _repeatWithAcceleration(callback, count + 1),
                Math.max(MAX_DELAY, INIT_DELAY - ACCELERATION * count)
            );
        } else {
            resolve();
        }
    });
}

@Component({
    moduleId: typeof module.id === "string" ? module.id : null,
    selector: 'cs-date-picker-month-select',
    template: `
    <div id="month-list">
        <div *ngFor="let month of _displayMonths.toArray(); let i = index">
            <div class="month-select rounded" 
                [ngClass]="{'selected': _isSelected(month)}"
                (click)="select(month)">

                <span class="month">{{month.format('MMMM')}}</span>
                <span class="year">{{month.format('Y')}}</span>

            </div>
        </div>
    </div>
    <div id="controls">
        <button
            class="btn btn-sm btn-outline-primary control control-add-year"
            (mousedown)="_beginRotateDisplay({year: 1}, $event)"
            (mouseup)="_endRotateDisplay($event)">
            <div class="icon-stack">
                <cs-icon name="caret-up"></cs-icon>     
                <cs-icon name="caret-up"></cs-icon>
            </div>
        </button> 
       
        <button class="btn btn-sm btn-outline-primary control control-add-month"
            (mousedown)="_beginRotateDisplay({month: 1}, $event)"
            (mouseup)="_endRotateDisplay($event)">
            <cs-icon name="caret-up"></cs-icon>
        </button>
        
        <div class="control-separator"></div>
        
        <button class="btn btn-sm btn-outline-primary control control-subtract-month"
            (mousedown)="_beginRotateDisplay({month: -1}, $event)"
            (mouseup)="_endRotateDisplay($event)">
            <cs-icon name="caret-down"></cs-icon>
        </button>
        
        <button class="btn btn-sm btn-outline-primary control control-subtract-year"
            (mousedown)="_beginRotateDisplay({year: -1}, $event)"
            (mouseup)="_endRotateDisplay($event)">
            <div class="icon-stack">
                <cs-icon name="caret-down"></cs-icon>
                <cs-icon name="caret-down"></cs-icon>
            </div>
        </button>
       
    </div>
    `,
    styleUrls: ['month-select.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsDatePickerMonthSelect {
    /// The selected month
    private _month: Moment;

    // Controls for the scroll buttons that increment and decrement the year and month
    private _rotation: {year?: number, month?: number} | null;

    /// The first displayed month.
    /// This is set so that initially the selected month is at the center of the display.
    /// The list can be rotated
    private _displayMonth: Moment;
    private get _displayMonths(): List<Moment> {
        return Range(0, 7)
            .map(i => this._displayMonth.clone().add({month: i}))
            .toList();
    }

    @Input()
    get month(): {year: number, month: number} {
        return {year: this._month.year(), month: this._month.month()};
    }
    set month(month: {year: number, month: number}) {
        this._month = this._month.clone()
            .year(month.year)
            .month(month.month);

        // There are 7 displayed months, so subtract 3 from the current month
        // for the display month.
        this._displayMonth = this._month.clone().subtract({month: 3});
    }

    @Output() monthChange = new EventEmitter<{year: number, month: number}>();

    constructor(private _cd: ChangeDetectorRef) {
        this._month = moment.utc().startOf('month');
    }

    private _isSelected(m: Moment) {
        return this._month.isSame(m, 'month');
    }

    private _beginRotateDisplay(amount: {year?: number, month?: number}, event: MouseEvent): Promise<void> {
        this._rotation = amount;
        return repeatWithAcceleration(
            () => {
                if (this._rotation === amount) {
                    this._displayMonth = this._displayMonth.clone().add(this._rotation);
                    this._cd.markForCheck();
                }
                // Return whether the delay should stop
                return !(this._rotation === amount);
            }
        )
    }

    private _endRotateDisplay(event: MouseEvent) {
        this._rotation = null;
    }

    select(month: Moment) {
        this._month = month.clone();
        this.monthChange.emit(this.month);
    }

    _jumpToYear(year: string): void {
        let numYear = Number.parseInt(year);
        if (Number.isNaN(numYear)) {
            return;
        }
        this._displayMonth = this._displayMonth.clone().year(numYear);
    }
}



