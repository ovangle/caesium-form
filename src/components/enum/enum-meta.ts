import {Iterable, List, OrderedMap} from 'immutable';

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

    constructor(valueMetas: CsEnumValue<T>[]) {
        this.valueMetas = List(valueMetas);
        this.displayValues = OrderedMap<T,string>(valueMetas.map(value => [value.value, value.display]));
    }

    get values(): Iterable<number,T> {
        return this.valueMetas.map(v => v.value);
    }

    get isNullable(): boolean {
        return this.valueMetas.some(v => v.value === null);
    }

    isOtherValue(value: T) {
        return !this.valueMetas
            .filter(v => v.value === value && v.isOther)
            .isEmpty();
    }



}
