import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {CsDropdownModule} from './dropdown/module';
import {CsModalModule} from './modal/module';

import {CsFormGroup} from './form-group/form-group';

export * from './dropdown/module';
export * from './modal/module';
export {CsFormGroup};


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CsModalModule,
        CsDropdownModule
    ],
    declarations: [
        CsFormGroup
    ],
    exports: [
        CsDropdownModule,
        CsModalModule,
        CsFormGroup,
    ]
})
export class CsBootstrapModule { }

