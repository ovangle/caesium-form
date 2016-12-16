import {Pipe, PipeTransform} from '@angular/core';

import {isString} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';

import {phoneCodec, PhoneNumber, PhoneLocalization} from '../../models/phone_number';

@Pipe({name: 'phone'})
export class CsPhonePipe implements PipeTransform {

    constructor(private localization: PhoneLocalization) {}

    transform(value: any, ...args: any[]): PhoneNumber {
        if (!args.length)
            throw new ArgumentError('CsPhonePipe: No type specified for phone number');
        if (!isString(value))
            return value;
        let format = this.localization.getFormat(args[0]);
        let codec = phoneCodec(format);
        return codec.decode(value);
    }
}
