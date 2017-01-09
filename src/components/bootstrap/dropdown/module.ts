import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CsDropdown} from './dropdown';
import {CsToggleModule} from '../../toggle/module';

export {CsDropdown};

@NgModule({
    imports: [CommonModule, CsToggleModule],
    declarations: [
        CsDropdown
    ],
    exports: [
        CsDropdown
    ]
})
export class CsDropdownModule{ }
