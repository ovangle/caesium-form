import {List, Map} from 'immutable';

import {Inject, Injectable, Optional, OpaqueToken} from '@angular/core';

import {isDefined, isBlank} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';
import {EncodingException, Codec} from 'caesium-core/codec';

export const DIGIT_PLACEHOLDER = 'd';

export type PhoneNumber = string;
export type PhoneNumberType = 'home' | 'mobile';

// TODO: move this to caesium-model
export type ValidatorFn<T> = (input: T) => {[err: string]: any};

export interface PhoneFormatErrors {
    tooShort?: boolean;
    tooLong?: boolean;
    // The index, expected value and actual value of the first invalid character in the string
    // If the expected value is DIGIT then the value is expected to be a digit.
    invalidCharacter?: [number, string, string];
}


/**
 * Returns a validator for the given localised phone number format string.
 *
 * @param format
 * @return
 * A validator function producing a PhoneNumberFormatErrors errors object
 * of
 */
export function phoneValidator(format: string): ValidatorFn<PhoneNumber> {
    return (phoneNumber: PhoneNumber) => {

        if (phoneNumber.length > format.length) {
            return {tooLong: true};
        }

        for (let fmtIndex = 0; fmtIndex < format.length; fmtIndex++) {
            let fmtChar = format.charAt(fmtIndex);
            if (fmtIndex >= phoneNumber.length) {
                return {tooShort: true};
            }
            let srcChar = phoneNumber.charAt(fmtIndex);
            if (fmtChar === DIGIT_PLACEHOLDER && !(/\d/.test(srcChar))) {
                return {
                    invalidCharacter: [fmtIndex, 'a digit', srcChar]
                };
            }
            if (fmtChar !== DIGIT_PLACEHOLDER && fmtChar !== srcChar) {
                return {
                    invalidCharacter: [fmtIndex, `'${fmtChar}'`, srcChar]
                };
            }
        }
        return undefined;
    }
}


/**
 * A codec for turning a string into a PhoneNumber.
 *
 * The format string is used to determine the structure of the phone number.
 * It is parsed in the following way
 * - A 'd' is replaced by the next digit in the raw phone number
 * - A digit is e
 *
 * Raises an EncodingException if:
 *  - There is a non-numeric character in the source input
 *  - There are more digits in the source than replacement char
 *
 *
 * e.g.
 * The format string 'dddd ddd ddd' would, given the input '0421234234' produce
 * the phone number 0421 234 234
 *
 * @param format
 * @param options
 * Should encoding exceptions be raised by the codec? Default is true
 * @returns {any}
 *
 */
export function phoneCodec(format: string, options?: {raiseExceptions: boolean}): Codec<PhoneNumber,string> {
    let raiseExceptions = !isDefined(options) || options.raiseExceptions;
    function _try(fn: () => void) {
        if (raiseExceptions) {
            fn();
        }
    }

    // The indexes of all the digits which are to be replaced.
    let formatDigits = List(format.split(''))
        .flatMap((fmtChar, fmtIndex) => fmtChar === DIGIT_PLACEHOLDER ? [fmtIndex]: []);

    let numFormatDigits = formatDigits.count();

    return {
        encode(source: PhoneNumber) {
            _try(() => {
                let errs = phoneValidator(format)(source);
                if (isDefined(errs)) {
                    throw new EncodingException(
                        'Invalid phone number: ' + JSON.stringify(errs)
                    );
                }
            });
            return source.replace(/\D/g, '')
                .substring(0, numFormatDigits);

        },
        decode(source: string): PhoneNumber {
            _try(() => {
                if (!/^\d*$/.test(source)) {
                    throw new EncodingException('Invalid character in raw phone number.');
                }

                if (source.length !== numFormatDigits) {
                    throw new EncodingException(
                        `Unexpected number of digits in raw phone number, expected ${numFormatDigits}`
                    );
                }
            });

            let fmtIndex = 0, sourceIndex = 0;
            let fmtChar: string;
            let formatted = '';

            for(; fmtIndex < format.length; fmtIndex++) {
                if (sourceIndex >= source.length)
                    break;

                fmtChar = format.charAt(fmtIndex);
                let sourceChar = source.charAt(sourceIndex);

                if (fmtChar === DIGIT_PLACEHOLDER) {
                    if (!/\d/.test(sourceChar))
                        break;
                    formatted += sourceChar;
                    sourceIndex++;
                } else {
                    formatted += fmtChar;
                }
            }

            return formatted;
        }
    };
}

//FIXME (typescript 2.1.?) : export type PhoneL10NConfig = { [K in PhoneNumberType]: string };
export type PhoneL10nConfig = {
    home: string;
    mobile: string;
}


export const PHONE_L10N_CONFIG = new OpaqueToken('cs_phone_localization_region');
export const defaultPhoneL10nConfig: PhoneL10nConfig = {
    home: '(dd) dddd dddd',
    mobile: 'dddd ddd ddd'
};

@Injectable()
export class PhoneLocalization {
    constructor(
        @Optional() @Inject(PHONE_L10N_CONFIG) private config: PhoneL10nConfig
    ) {
        if (isBlank(config))
            this.config = defaultPhoneL10nConfig;
    }


    getFormat(phoneType?: PhoneNumberType): string {
        if (!isDefined(phoneType))
            return this.config.home;

        switch (phoneType) {
            case 'home':
                return this.config.home;
            case 'mobile':
                return this.config.mobile;
            default:
                throw new ArgumentError(`Invalid type for phone number: '${phoneType}'`);
        }
    }
}
