import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';

import {CsIconModule} from '../icon/module';

import {CsEmailInput} from './email-input';
import {CsEmailAnchor} from './email-anchor';

export {CsEmailInput, CsEmailAnchor};

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, CsIconModule],
    declarations: [
        CsEmailInput,
        CsEmailAnchor
    ],
    exports: [
        CsEmailInput,
        CsEmailAnchor
    ]
})
export class CsEmailModule { }
