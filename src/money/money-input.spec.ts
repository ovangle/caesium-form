import 'rxjs/add/operator/toPromise';

import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CsIconModule} from '../icon/module';

import {CS_CURRENCY} from './money';
import {CsMoneyInput} from './money-input';
import {australianDollar} from './money.spec';

@Component({
    selector: 'cs-money-input-host',
    template: `
    <cs-money-input 
        [money]="money" 
        (moneyChange)="moneyChange.emit($event)"></cs-money-input>
    `
})
export class CsMoneyInputHost {
    @Input() money: number;
    @Output() moneyChange = new EventEmitter<number>();
}

@Component({
    selector: 'cs-money-input-control-value-accessor-host',
    template: `
    <cs-money-input [(ngModel)]="money"></cs-money-input>
    `
})
export class CsMoneyInputControlValueAccessorHost {
    @Input() money: number;
}

describe('components.money.money-input', () => {
    describe('MoneyInput', () => {
        let fixture: ComponentFixture<CsMoneyInputHost>;
        beforeEach(async(done) => {
            TestBed.configureTestingModule({
                imports: [CommonModule, FormsModule, CsIconModule],
                declarations: [
                    CsMoneyInput,
                    CsMoneyInputHost
                ],
                providers: [
                    {provide: CS_CURRENCY, useValue: australianDollar}
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsMoneyInputHost);
            done();
        });

        it('should input and display a monetary value', async (done) => {
            fixture.componentInstance.money = 42.44;
            let moneyInput = fixture.debugElement.query(By.css('cs-money-input'));

            let rawInput = moneyInput.query(By.css('input'));
            expect(rawInput.nativeElement.value).toEqual('42.44', 'Should reflect the input value');

            let moneyChange$ = fixture.componentInstance.moneyChange.first().toPromise();

            rawInput.triggerEventHandler('input', '12.34');
            fixture.detectChanges();

            let value = await moneyChange$;

            expect(value).toEqual(12.34);
            done();
        });
    });

    describe('MoneyInputControlValueAccessor', () => {
        let fixture: ComponentFixture<CsMoneyInputControlValueAccessorHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                imports: [CommonModule, FormsModule, CsIconModule],
                declarations: [
                    CsMoneyInput,
                    CsMoneyInputHost
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsMoneyInputHost);
            done();
        });

        it('should input and display a monetary value', () => {
            fixture.componentInstance.money = 42.44;
            let moneyInput = fixture.debugElement.query(By.css('cs-money-input'));
            expect(moneyInput.componentInstance.money).toBe(42.44, 'ngModel input');

            let rawInput = moneyInput.query(By.css('input'));
            expect(rawInput.nativeElement.value).toEqual('42.44');

            rawInput.triggerEventHandler('input', '12.34');
            fixture.detectChanges();
            expect(fixture.componentInstance.money).toEqual(12.34, 'NgModel change');
        });
    });
});
