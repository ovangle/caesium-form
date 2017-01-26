import {Iterable, List, OrderedMap} from 'immutable';

import {isBlank} from 'caesium-core/lang';
import {Converter, identityConverter} from 'caesium-core/converter';
import {ArgumentError} from 'caesium-core/exception';

export interface CsEnumValue<T> {
    /// The value to store as the selection. Must be comparable by `===`.
    value: T | null;

    /// Display text to add to the selection
    display: string;

    /// Is this value the "other" value of the enum?
    /// An enum has an other value if there are acceptable inputs for the enum outside the
    /// domain knowledge of the application
    isOther?: boolean;
}

export class CsEnum<T> {
    valueMetas: List<CsEnumValue<T>>;
    displayValues: OrderedMap<T,string>;
    private formatOther: Converter<string,string>;

    constructor(valueMetas: CsEnumValue<T>[], options?: {formatOther: Converter<string,string>}) {
        this.valueMetas = List(valueMetas);
        this.displayValues = OrderedMap<T,string>(valueMetas.map(value => [value.value, value.display]));
        this.formatOther = (options && options.formatOther) || identityConverter;
    }

    get values(): Iterable<number,T> {
        return this.valueMetas.map(v => v.value);
    }

    get isNullable(): boolean {
        return this.valueMetas.some(v => v.value === null);
    }

    get hasOtherValue(): boolean {
        return this.valueMetas.some(v => v.isOther );
    }

    isOtherValue(value: T) {
        return !this.valueMetas
            .filter(v => v.value === value && v.isOther)
            .isEmpty();
    }

    formatValue(value: T, otherDescription?: string) {
        if (this.isOtherValue(value)) {
            if (isBlank(otherDescription))
                throw new ArgumentError('No other description provided');

            return this.formatOther(otherDescription);
        }
        return this.displayValues.get(value, value.toString());
    }
}
