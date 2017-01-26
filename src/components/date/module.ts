import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CsIconModule} from '../icon/module';
import {CsBootstrapModule} from '../bootstrap/module';
import {CsDatePickerModule} from './picker/module';

import {CsDateInput, CsDateInputValueAccessor} from './date-input';

export {CsDateInput};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CsIconModule,
        CsBootstrapModule,
        CsDatePickerModule
    ],
    declarations: [
        CsDateInput,
        CsDateInputValueAccessor
    ],
    exports: [
        // Re-export the date pipe from @angular/common for symmmetry with other datatype based
        // modules (eg. Money, Phone etc.)
        DatePipe,
        CsDateInput,
        CsDateInputValueAccessor
    ]
})
export class CsDateModule {

}
