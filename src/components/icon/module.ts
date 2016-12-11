import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CsIcon} from './icon';

export {CsIcon};

@NgModule({
    imports: [CommonModule],
    declarations: [CsIcon],
    exports: [CsIcon]
})
export class IconModule {}



