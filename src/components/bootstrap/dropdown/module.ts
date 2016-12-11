import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CsDropdown, CsDropdownToggle} from './dropdown';
import {CsDropdownMenu, CsMenuAction} from './dropdown-menu';

export {CsDropdown, CsDropdownToggle, CsDropdownMenu, CsMenuAction};

@NgModule({
    imports: [CommonModule],
    declarations: [
        CsDropdown,
        CsDropdownToggle,
        CsDropdownMenu,
        CsMenuAction
    ],
    exports: [
        CsDropdown,
        CsDropdownToggle,
        CsDropdownMenu,
        CsMenuAction
    ]
})
export class CsDropdownModule{ }
