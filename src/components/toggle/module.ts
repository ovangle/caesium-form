import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CsToggleOption, CsSimpleToggleOption, CsOnOffToggle, CsToggle} from './toggle';

export {CsToggleOption, CsToggle} from './toggle';

@NgModule({
    imports: [CommonModule],
    declarations: [
        CsSimpleToggleOption,
        CsOnOffToggle,
        CsToggle
    ],
    exports: [
        CsSimpleToggleOption,
        CsOnOffToggle,
        CsToggle
    ]
})
export class CsToggleModule {}
