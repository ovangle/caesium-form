import {OpaqueToken} from '@angular/core';

import {isBlank} from 'caesium-core/lang';
import {Codec, EncodingException} from 'caesium-core/codec';

// TODO: This needs to be moved elsewhere
export type ValidatorFn<T> = (input: T) => {[err: string]: any};

/**
 * Token used to inject the currency of the current locale.
 * @type {OpaqueToken}
 */
export const CS_CURRENCY = new OpaqueToken('cs_currency');

export interface Currency {
    // The unicode string representing the symbol to use to represent the currency.
    symbol?: string;

    // The name of an icon to represent the currency.
    // Providing an icon name will override any symbol used for the currency.
    icon?: string;

    // The 3 character currency code.
    code: string;

    // The number of decimal places in the currency
    minorUnits: number;
}

export interface InvalidCharacterError {
    character: string;
    index: number;
    suggest?: string;
}

function invalidCharacterErrorToString(error: InvalidCharacterError) {
    return `Invalid character at ${error.index} (\'${error.character}\')`;
}

export interface CurrencyDisplayValidationErrors {
    // The input was empty
    empty?: boolean;

    // There was an invalid character in the input. The value
    invalidChar?: InvalidCharacterError;

    multipleDecimalPoints?: boolean;

    tooFewMinorUnits?: boolean;

    /// More units after the decimal place than allowed
    tooManyMinorUnits?: boolean;

    // The currency used to validate the input.
    currency: Currency;

    // The validator will populate this with a valid input
    // formed by
    //      1. Removing invalid letters from the end of the string
    suggest: string;
}
function moneyValidationToString(errors: CurrencyDisplayValidationErrors) {
    let currency = errors.currency;
    let msg: string = '';
    if (errors.empty) {
        msg = 'Empty input.'
    }
    if (errors.invalidChar) {
        msg = invalidCharacterErrorToString(errors.invalidChar);
    }
    if (errors.tooFewMinorUnits) {
        msg = `Too few minor units of currency, ${currency.code} has ${currency.minorUnits}.`;
    }
    if (errors.tooManyMinorUnits) {
        msg = `Too many minor units of currency, ${currency.code} has ${currency.minorUnits}`;
    }
    return msg + '\nsuggest: ' + errors.suggest;
}

export function moneyValidator(currency: Currency): ValidatorFn<string> {
    let baseError = {currency: currency};

    return (input: string) => {
        if (isBlank(input) || input.length === 0) {
            return {
                empty: true,
                suggest: ''
            };
        }

        for (let i=0;i<input.length;i++) {
            if (!/[0-9.]/.test(input[i])) {
                return Object.assign({}, baseError, {
                    invalidChar: i,
                    suggest: input.substring(0, i)
                });
            }
        }

        let decimalIndex = input.indexOf('.');
        let lastDecimalIndex = input.lastIndexOf('.');

        if (decimalIndex === 0) {
            return Object.assign({}, baseError, {
                noMajorUnits: true,
                suggest: '0' + input
            });
        }

        if (decimalIndex !== lastDecimalIndex) {
            return Object.assign({}, baseError, {
                multipleDecimalPoints: true,
                suggest: input.substring(0, lastDecimalIndex)
            });
        }

        let minorUnitsIndex = decimalIndex + 1;
        let numMinorUnits = input.length - minorUnitsIndex;
        if (numMinorUnits > currency.minorUnits) {
            return Object.assign({}, baseError, {
                tooManyMinorUnits: true,
                suggest: input.substring(0, minorUnitsIndex + currency.minorUnits)
            });
        } else if (numMinorUnits < currency.minorUnits) {
            let numRequired = currency.minorUnits - numMinorUnits;
            let padding = new Array(numRequired).fill('0').join('');
            return Object.assign({}, baseError, {
                tooFewMinorUnits: true,
                suggest: input + padding
            });
        }

        return null;
    }
}

export function moneyDisplayCodec(currency: Currency, options?: {raiseException: boolean}): Codec<number,string> {
    let raiseException = isBlank(options) || options.raiseException;
    function _try(fn: () => any) {
        if (raiseException)
            fn();
    }

    let validator = moneyValidator(currency);

    return {
        encode: (value: number) => {
            _try(() => {
                if (Number.isNaN(value))
                    throw new EncodingException(`NaN is not a valid money value`);
                if (!Number.isFinite(value))
                    throw new EncodingException('Money values must be finite');
            });

            if (isBlank(value)) {
                return '';
            }

            return value.toFixed(currency.minorUnits);
        },
        decode: (value: string) => {
            _try(() => {
                let validation = <CurrencyDisplayValidationErrors>validator(value);
                if (!isBlank(validation)) {
                    throw new EncodingException(moneyValidationToString(validation));
                }
            });

            if (isBlank(value) || value === '')
                return null;

            return Number.parseFloat(value);
        }
    }
}
