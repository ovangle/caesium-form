import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {CsIconModule} from '../icon/module';

import {CsEnum} from './enum-meta';
import {CsEnumPipe} from './enum-pipe';
import {CsEnumSelect} from './enum-select';

export {CsEnum, CsEnumSelect, CsEnumPipe};

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CsIconModule
    ],
    declarations: [
        CsEnumSelect,
        CsEnumPipe
    ],
    exports: [
        CsEnumSelect,
        CsEnumPipe
    ]
})
export class CsEnumModule { }
