import {Pipe, PipeTransform} from '@angular/core';

import {isString} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';

import {phoneFormatter} from './phone_number';

@Pipe({name: 'phone'})
export class CsPhonePipe implements PipeTransform {

    constructor() {}

    transform(value: any, ...args: any[]): string {
        if (!args.length)
            throw new ArgumentError('CsPhonePipe: No type specified for phone number');
        if (!isString(value))
            return value;

        let formatter = phoneFormatter(args[0]);
        return formatter(value);
    }
}
