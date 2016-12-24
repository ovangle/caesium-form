import {Pipe, PipeTransform} from '@angular/core';

import {ArgumentError} from 'caesium-core/exception';

import {CsEnum} from './enum-meta';

@Pipe({name: 'enum'})
export class CsEnumPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        if (args.length === 0)
            throw new ArgumentError('A `CsEnum` instance must be provided as argument');
        let enumType: CsEnum<any> = args[0];

        if (enumType.hasOtherValue && args.length < 2) {
            throw new ArgumentError('A `CsEnum` which supports "OTHER" values must provide the other description value to the pipe');
        }
        return enumType.formatValue(value, args[1]);
    }
}

