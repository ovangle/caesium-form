import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {CsDropdownModule} from './dropdown/module';
import {CsModalModule} from './modal/module';

import {CsFormGroup, CsIfInputError} from './form-group';

export * from './dropdown/module';
export * from './modal/module';
export {CsFormGroup, CsIfInputError};


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CsModalModule,
        CsDropdownModule
    ],
    declarations: [
        CsIfInputError,
        CsFormGroup
    ],
    exports: [
        CsDropdownModule,
        CsModalModule,
        CsFormGroup,
        CsIfInputError
    ]
})
export class CsBootstrapModule { }

