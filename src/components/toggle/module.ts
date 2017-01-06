import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CsToggleOption, CsSimpleToggleOption, CsToggle} from './toggle';

export {CsToggleOption, CsToggle} from './toggle';



@NgModule({
    imports: [CommonModule],
    declarations: [
        CsSimpleToggleOption,
        CsToggle
    ],
    exports: [
        CsSimpleToggleOption,
        CsToggle
    ]
})
export class CsToggleModule {}
