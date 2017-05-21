import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {CsMaskedInputModule} from '../masked-input/module';
import {CsIconModule} from '../icon/module';

import {CsPhoneInput, CsMobilePhoneInput} from './phone-input';
import {CsPhonePipe, CsMobilePhonePipe} from './phone-pipe';

export {CsPhoneInput, CsPhonePipe, CsMobilePhoneInput, CsMobilePhonePipe};

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CsMaskedInputModule,
        CsIconModule
    ],
    declarations: [
        CsPhoneInput,
        CsMobilePhoneInput,
        CsPhonePipe,
        CsMobilePhonePipe
    ],
    exports: [
        CsPhoneInput,
        CsMobilePhoneInput,
        CsPhonePipe,
        CsMobilePhonePipe
    ]
})
export class CsPhoneModule {}

