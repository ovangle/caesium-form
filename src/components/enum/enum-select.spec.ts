import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

import {List} from 'immutable';

import {
    Component, Input,
    ViewChild, ElementRef,
    getDebugNode, DebugElement
} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';

import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {CsIconModule} from '../icon/module';
import {CsEnumSelect} from './enum-select';

import {BasicEnum, AllowNullEnum, AllowOtherEnum} from './enum-meta.spec';


@Component({
    selector: 'cs-enum-select-host',
    template: `
    <cs-enum-select #basic 
        [enum]="_basicEnum" [(ngModel)]="basicValue"></cs-enum-select>
    <cs-enum-select #allowNull
        [enum]="_allowNullEnum" [(ngModel)]="value"></cs-enum-select>
    <cs-enum-select #allowOther
        [enum]="_allowOtherEnum" [(ngModel)]="value">
        <input #otherDescriptionInput type="text" class="form-control"
            [(ngModel)]="otherDescription">
    </cs-enum-select>
    `
})
class CsEnumHost {
    private _basicEnum = BasicEnum;
    private _allowNullEnum = AllowNullEnum;
    private _allowOtherEnum = AllowOtherEnum;

    @Input() basicValue: any;
    @Input() allowNullValue: any;
    @Input() allowOtherValue: any;
    @Input() otherDescription: any;

    @ViewChild('basic', {read: ElementRef})
    _basicEnumElement: ElementRef;
    get basicEnum() { return getDebugNode(this._basicEnumElement.nativeElement); }

    @ViewChild('allowNull', {read: ElementRef})
    _allowNullElement: ElementRef;
    get allowNullEnum() { return getDebugNode(this._allowNullElement.nativeElement); }

    @ViewChild('allowOther', {read: ElementRef})
    _allowOtherElement: ElementRef;
    get allowOtherEnum() { return getDebugNode(this._allowOtherElement.nativeElement); }

}

describe('components.enum.enum-select', () => {
    let fixture: ComponentFixture<CsEnumHost>;

    beforeEach(async (done) => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule, CsIconModule],
            declarations: [
                CsEnumSelect,
                CsEnumHost
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CsEnumHost);
        fixture.detectChanges();

        done();
    });

    it('should be possible to support a basic enumerated type', async (done) => {

        let enumSelect = <DebugElement>fixture.componentInstance.basicEnum;
        let select = enumSelect.query(By.css('select'));
        let options = select.queryAll(By.css('option'));

        expect(options[0].nativeElement.value).toEqual('0: OPTION_A');
        expect(options[1].nativeElement.value).toEqual('1: OPTION_B');
        expect(options[2].nativeElement.value).toEqual('2: OPTION_C');

        select.triggerEventHandler('change', {target: options[1].nativeElement});
        fixture.detectChanges();
        expect(enumSelect.componentInstance.value).toBe('OPTION_B');

        enumSelect.componentInstance.value = 'OPTION_C';
        fixture.detectChanges();
        window.setTimeout(() => {
            expect(select.nativeElement.value).toBe('2: OPTION_C');
            done();
        });
    });

    it('should be possible to null an enum value', () => {
        let enumSelect = <DebugElement>fixture.componentInstance.allowNullEnum;
        let select = enumSelect.query(By.css('select'));
        let options = select.queryAll(By.css('option'));

        expect(options[0].nativeElement.value).toEqual('0: null');
        expect(options[1].nativeElement.value).toEqual('1: OPTION_A');
        expect(options[2].nativeElement.value).toEqual('2: OPTION_B');
        expect(options[3].nativeElement.value).toEqual('3: OPTION_C');

        enumSelect.componentInstance.value = 'OPTION_A';

        select.triggerEventHandler('change', {target: options[0].nativeElement});
        fixture.detectChanges();
        expect(enumSelect.componentInstance.value).toBe(null);

    });

    it('should be possible to input arbitrary text for an enum', () => {
        let enumSelect = <DebugElement>fixture.componentInstance.allowOtherEnum;
        let select = enumSelect.query(By.css('select'));
        let options = select.queryAll(By.css('option'));

        expect(options[0].nativeElement.value).toEqual('0: OPTION_A');
        expect(options[1].nativeElement.value).toEqual('1: OPTION_B');
        expect(options[2].nativeElement.value).toEqual('2: OPTION_C');
        expect(options[3].nativeElement.value).toEqual('3: OTHER');

        expect(enumSelect.query(By.css('input[type=text'))).toBe(null, 'Should not display the other description input');

        enumSelect.componentInstance.value = 'OPTION_A';

        select.triggerEventHandler('change', {target: options[3].nativeElement});
        fixture.detectChanges();
        expect(enumSelect.componentInstance.value).toBe('OTHER');
        expect(enumSelect.query(By.css('input'))).not.toBe(null, 'Should display the other description input');

        enumSelect.componentInstance.value = 'OPTION_B';
        fixture.detectChanges();
        expect(enumSelect.query(By.css('input'))).toBe(null, 'Should hide the other description input');
    });
});

