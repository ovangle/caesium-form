import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InputMask} from './model';
import {CsMaskedInput, CsMask, CsMaskValidator} from './directives';

export {InputMask, CsMask, CsMaskedInput, CsMaskValidator};

@NgModule({
    imports: [CommonModule],
    declarations: [
        CsMask,
        CsMaskedInput,
        CsMaskValidator
    ],
    exports: [
        CsMask,
        CsMaskedInput,
        CsMaskValidator
    ]
})
export class CsMaskedInputModule {}
