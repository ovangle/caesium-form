import {Pipe, PipeTransform} from '@angular/core';

import {InputMask} from '../masked-input/module';

@Pipe({name: 'phone'})
export class CsPhonePipe implements PipeTransform {
    public mask: InputMask = new InputMask('(99) 9999 9999', true);

    transform(value: any, ...args: any[]): string {
        return this.mask.modelOrViewModelToView(value);
    }
}

@Pipe({name: 'mobilePhone'})
export class CsMobilePhonePipe implements PipeTransform {
    public mask: InputMask = new InputMask('9999 999 999', true);

    transform(value: any, ...args: any[]): string {
        return this.mask.modelOrViewModelToView(value);
    }
}
