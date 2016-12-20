import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {CsIconModule} from '../icon/module';

import {CsEnumSelect} from './enum-select';

export {CsEnumSelect};

@NgModule({
    imports: [CommonModule, FormsModule, CsIconModule],
    declarations: [CsEnumSelect]
})
export class CsEnumModule { }
