import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';

import {CsIconModule} from '../icon/module';

import {CsEmailInput, EmailInputControlValueAccessor} from './email-input';

export {CsEmailInput};

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, CsIconModule],
    declarations: [
        CsEmailInput
    ],
})
export class CsEmailModule { }
