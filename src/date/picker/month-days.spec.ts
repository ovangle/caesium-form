import moment from 'moment';
import {Moment} from 'moment';

import {List} from 'immutable';

import {
    Component, Input,
    getDebugNode, DebugElement
} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';

import {CsIconModule} from '../../icon/module';
import {CsDatePickerMonthDays} from './month-days';

@Component({
    selector: 'cs-date-picker-month-days-host',
    template: `
    <cs-date-picker-month-days
        [displayMonth]="displayMonth"
        [date]="date"
        (dateChange)="setDate($event)">
    </cs-date-picker-month-days>
    `
})
class CsDatePickerMonthDaysHost {
    @Input() displayMonth: {year: number, month: number};
    @Input() date: Moment;

    setDate(date: Moment) {
        this.date = date;
    }
}

describe('components.date.picker.month-days', () => {
    let fixture: ComponentFixture<CsDatePickerMonthDaysHost>;

    function getDayCell(test: (cell: HTMLTableCellElement) => boolean): HTMLTableCellElement {
        let monthdayList = fixture.debugElement.query(By.directive(CsDatePickerMonthDays));
        return List<HTMLTableCellElement>(monthdayList.nativeElement.querySelectorAll('td'))
            .filter(td => test(td))
            .first();
    }

    function getNextMonthCell(): HTMLTableHeaderCellElement {
        let monthdayList = fixture.debugElement.query(By.directive(CsDatePickerMonthDays));
        return monthdayList.nativeElement.querySelector('th.display-next-month')
    }

    beforeEach(async (done) => {
        TestBed.configureTestingModule({
            imports: [CommonModule, CsIconModule],
            declarations: [
                CsDatePickerMonthDays,
                CsDatePickerMonthDaysHost
            ]
        });
        await TestBed.compileComponents();

        fixture = TestBed.createComponent(CsDatePickerMonthDaysHost);
        done();
    });

    it('should have a list of weekdays for the specified displayYear and displayMonth', () => {

        let monthdayList = fixture.debugElement.query(By.directive(CsDatePickerMonthDays));

        fixture.componentInstance.displayMonth = {year: 2012, month: 10};
        fixture.detectChanges();
        let weekdays = monthdayList.componentInstance._monthWeeks;

        // November 2012 runs from Sun 28 Oct to Sat 8 December
        expect(weekdays[0][0].toISOString()).toEqual('2012-10-28T00:00:00.000Z');
        expect(weekdays[5][6].toISOString()).toEqual('2012-12-08T00:00:00.000Z');

        fixture.componentInstance.displayMonth = {year: 1968, month: 4};
        fixture.detectChanges();

        weekdays = monthdayList.componentInstance._monthWeeks;

        // May 1968 runs from Sun 28 April - Sat 6 June
        expect(weekdays[0][0].toISOString()).toEqual('1968-04-28T00:00:00.000Z');
        expect(weekdays[5][6].toISOString()).toEqual('1968-06-08T00:00:00.000Z');
    });


    it('should be possible to select a date by clicking on it', () => {
        fixture.componentInstance.displayMonth = {year: 2918, month: 6};
        fixture.detectChanges();

        let dayCell = <DebugElement>getDebugNode(getDayCell(elem => /15/.test(elem.textContent)));

        dayCell.triggerEventHandler('click', {});
        fixture.detectChanges();

        let monthdayList = fixture.debugElement.query(By.directive(CsDatePickerMonthDays));
        expect(monthdayList.componentInstance.isSelected(moment.utc({year: 2918, month: 6, day: 15})));

        dayCell = <DebugElement>getDebugNode(getDayCell(elem => /15/.test(elem.textContent)));
        expect(fixture.componentInstance.date.toISOString())
            .toEqual('2918-07-15T00:00:00.000Z');

    });

});
