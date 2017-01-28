import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {CsIconModule} from '../icon/module';

import {PhoneLocalization} from './phone_number';

import {CsPhoneInput, PhoneInputControlValueAccessor} from './phone-input';
import {CsPhonePipe} from './phone-pipe';

export {CsPhoneInput, CsPhonePipe};

@NgModule({
    imports: [CommonModule, CsIconModule, ReactiveFormsModule],
    declarations: [
        CsPhoneInput,
        CsPhonePipe
    ],
    providers: [
        PhoneLocalization,
        {provide: NG_VALUE_ACCESSOR, useClass: PhoneInputControlValueAccessor, multi: true}
    ],
    exports: [
        CsPhoneInput,
        CsPhonePipe
    ]
})
export class CsPhoneModule {}
