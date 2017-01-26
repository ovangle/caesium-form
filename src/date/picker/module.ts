import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CsToggleModule} from '../../toggle/module';
import {CsBootstrapModule} from '../../bootstrap/module';
import {CsIconModule} from '../../icon/module';

import {CsDatePickerMonthSelect} from './month-select';
import {CsDatePickerMonthDays} from './month-days';
import {CsDatePickerNav} from './nav';

import {CsDatePicker} from './date-picker';

export {CsDatePicker};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CsBootstrapModule,
        CsToggleModule,
        CsIconModule
    ],
    declarations: [
        CsDatePickerMonthSelect,
        CsDatePickerMonthDays,
        CsDatePickerNav,
        CsDatePicker
    ],
    exports: [
        CsDatePicker,
        // TODO: Remove this export (after making docs generic)
        CsDatePickerMonthSelect
    ]
})
export class CsDatePickerModule {}

