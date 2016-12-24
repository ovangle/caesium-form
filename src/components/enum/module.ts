import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CsIconModule} from '../icon/module';

import {CsEnum} from './enum-meta';
import {CsEnumPipe} from './enum-pipe';
import {CsEnumSelect} from './enum-select';

export {CsEnum, CsEnumSelect, CsEnumPipe};

@NgModule({
    imports: [CommonModule, FormsModule, CsIconModule],
    declarations: [
        CsEnumSelect,
        CsEnumPipe
    ]
})
export class CsEnumModule { }
