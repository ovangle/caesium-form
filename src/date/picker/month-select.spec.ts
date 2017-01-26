import {List} from 'immutable';

import {
    Component, Input,
    DebugElement, getDebugNode
} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';

import {CsIconModule} from '../../icon/module';

import {CsDatePickerMonthSelect} from './month-select';

@Component({
    selector: 'cs-date-picker-month-select-host',
    template: `
    <cs-date-picker-month-select
        [month]="month" 
        (monthChange)="month = $event">
    </cs-date-picker-month-select>
    `
})
class CsDatePickerMonthSelectHost {
    @Input() month: {month: number, year: number};
}

describe('components.date.picker.month-select', () => {
    describe('CsDatePickerMonthSelect', () => {
        let fixture: ComponentFixture<CsDatePickerMonthSelectHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [
                    CommonModule,
                    CsIconModule,
                ],
                declarations: [
                    CsDatePickerMonthSelect,
                    CsDatePickerMonthSelectHost
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsDatePickerMonthSelectHost);

            done();
        });

        function getOptions(): List<DebugElement> {
            return List(fixture.debugElement.queryAll(By.css('.month-select')));
        }

        function getOption(
            testMonth: (month: DebugElement) => boolean,
            testYear: (year: DebugElement) => boolean
        ): DebugElement {
            let options = getOptions();

            return options.filter(option => {
                let monthSpan = option.query(By.css('span.month'));
                let yearSpan = option.query(By.css('span.year'));

                return testMonth(monthSpan) && testYear(yearSpan);
            }).first();
        }

        function expectIsFirstOption(option: DebugElement) {
            let options = getOptions();

            expect(options.first().nativeElement)
                .toBe(option.nativeElement, 'should be first displayed option');
        }

        it('should display the months surrounding the display month', () => {
            fixture.componentInstance.month = {month: 10, year: 2012};
            fixture.detectChanges();

            let options = getOptions();

            let firstSurrounding = getOption(
                (monthSpan) => /August/.test(monthSpan.nativeElement.textContent),
                (yearSpan) => /2012/.test(yearSpan.nativeElement.textContent)
            );

            console.log('firstSurrounding', firstSurrounding);
            console.log('first option', options.first());

            console.log('equal', firstSurrounding === options.first())

            expect(firstSurrounding.nativeElement)
                .toBe(options.first().nativeElement, 'first month should be three months before the display month');

            let lastSurrounding = getOption(
                (monthSpan) => /February/.test(monthSpan.nativeElement.textContent),
                (yearSpan) => /2013/.test(yearSpan.nativeElement.textContent)
            );

            expect(lastSurrounding.nativeElement)
                .toBe(options.last().nativeElement, 'last month should be three months after the display month');

            fixture.componentInstance.month = {month: 3, year: 1968};
            fixture.detectChanges();

            let newFirstSurrounding = getOption(
                (monthSpan) => /January/.test(monthSpan.nativeElement.textContent),
                (yearSpan) => /1968/.test(yearSpan.nativeElement.textContent)
            );

            expect(getOptions().first().nativeElement)
                .toBe(newFirstSurrounding.nativeElement, 'updating the month should update the options')
        });

        it('should select the month when the option is clicked', () => {
            fixture.componentInstance.month = {month: 9, year: 1945};
            fixture.detectChanges();

            let julyOption = getOption(
                monthSpan => /July/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1945/.test(yearSpan.nativeElement.textContent)

            );

            julyOption.triggerEventHandler('click', {});
            fixture.detectChanges();

            expect(fixture.componentInstance.month)
                .toEqual({month: 6, year: 1945});
        });

        it('should rotate the displayed months when the month increment button is pressed', () => {
            fixture.componentInstance.month = {month: 9, year: 1934};
            fixture.detectChanges();

            // July should be the first option
            expectIsFirstOption(getOption(
                monthSpan => /July/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1934/.test(yearSpan.nativeElement.textContent)
            ));

            let monthIncrement = fixture.debugElement.query(By.css('.control-add-month'));

            monthIncrement.triggerEventHandler('mousedown', {});
            monthIncrement.triggerEventHandler('mouseup', {});
            fixture.detectChanges();


            // August should be the new first option
            expectIsFirstOption(getOption(
                monthSpan => /August/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1934/.test(yearSpan.nativeElement.textContent)
            ));

            // Should not change the selected month
            expect(fixture.componentInstance.month).toEqual({month: 9, year: 1934});
        });


        it('should rotate the displayed years when the month decrement button is pressed', () => {
            fixture.componentInstance.month = {month: 9, year: 1934};
            fixture.detectChanges();

            // July should be the first option
            expectIsFirstOption(getOption(
                monthSpan => /July/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1934/.test(yearSpan.nativeElement.textContent)
            ));

            let monthIncrement = fixture.debugElement.query(By.css('.control-subtract-month'));

            monthIncrement.triggerEventHandler('mousedown', {});
            monthIncrement.triggerEventHandler('mouseup', {});
            fixture.detectChanges();

            // August should be the new first option
            expectIsFirstOption(getOption(
                monthSpan => /June/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1934/.test(yearSpan.nativeElement.textContent)
            ));

            // Should not change the selected month
            expect(fixture.componentInstance.month).toEqual({month: 9, year: 1934});
        });


        it('should rotate the displayed years when the year decrement button is pressed', () => {
            fixture.componentInstance.month = {month: 9, year: 1934};
            fixture.detectChanges();

            // July should be the first option
            expectIsFirstOption(getOption(
                monthSpan => /July/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1934/.test(yearSpan.nativeElement.textContent)
            ));

            let monthIncrement = fixture.debugElement.query(By.css('.control-subtract-year'));

            monthIncrement.triggerEventHandler('mousedown', {});
            monthIncrement.triggerEventHandler('mouseup', {});
            fixture.detectChanges();


            // August should be the new first option
            expectIsFirstOption(getOption(
                monthSpan => /July/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1933/.test(yearSpan.nativeElement.textContent)
            ));


            // Should not change the selected month
            expect(fixture.componentInstance.month).toEqual({month: 9, year: 1934});
        });


        it('should rotate the displayed years when the year increment button is pressed', () => {
            fixture.componentInstance.month = {month: 9, year: 1934};
            fixture.detectChanges();

            // July should be the first option
            expectIsFirstOption(getOption(
                monthSpan => /July/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1934/.test(yearSpan.nativeElement.textContent)
            ));

            let monthIncrement = fixture.debugElement.query(By.css('.control-add-year'));

            monthIncrement.triggerEventHandler('mousedown', {});
            monthIncrement.triggerEventHandler('mouseup', {});
            fixture.detectChanges();


            // August should be the new first option
            expectIsFirstOption(getOption(
                monthSpan => /July/.test(monthSpan.nativeElement.textContent),
                yearSpan => /1935/.test(yearSpan.nativeElement.textContent)
            ));

            // Should not change the selected month
            expect(fixture.componentInstance.month).toEqual({month: 9, year: 1934});
        });

        // Only do this test for month increment, the others all use the same method
        it('should rotate multiple months when the increment button is held down', async (done) => {
            fixture.componentInstance.month = {month: 7, year: 2036};
            fixture.detectChanges();

            let monthIncrement = fixture.debugElement.query(By.css('.control-add-month'));

            expectIsFirstOption(getOption(
                monthSpan => /May/.test(monthSpan.nativeElement.textContent),
                yearSpan => /2036/.test(yearSpan.nativeElement.textContent)
            ));

            monthIncrement.triggerEventHandler('mousedown', {});
            await new Promise(resolve => window.setTimeout(resolve, 1500));
            monthIncrement.triggerEventHandler('mouseup', {});
            fixture.detectChanges();

            expectIsFirstOption(getOption(
                monthSpan => /September/.test(monthSpan.nativeElement.textContent),
                yearSpan => /2036/.test(yearSpan.nativeElement.textContent)
            ));

            done();
        }, 2000)


    });
});
