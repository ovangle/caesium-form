import {NgModule} from '@angular/core';

import {CsEmailModule} from './email/module';
import {CsEnumModule} from './enum/module';
import {CsIconModule} from './icon/module';
import {CsPhoneModule} from './phone/module';
import {CsSpinnerModule} from './spinner/module';
import {CsToggleModule} from './toggle/module';

export * from './email/module';
export * from './enum/module';
export * from './icon/module';
export * from './phone/module';
export * from './spinner/module';
export * from './toggle/module';

@NgModule({
    imports: [
        CsEmailModule,
        CsEnumModule,
        CsIconModule,
        CsPhoneModule,
        CsSpinnerModule,
        CsToggleModule
    ],
    exports: [
        CsEmailModule,
        CsEnumModule,
        CsIconModule,
        CsPhoneModule,
        CsSpinnerModule,
        CsToggleModule
    ]
})
export class CaesiumFormModule {

}
