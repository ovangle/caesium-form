
import {List, Map} from 'immutable';

import {Inject, Injectable, Optional, OpaqueToken} from '@angular/core';

import {isDefined, isBlank} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';
import {EncodingException, Codec} from 'caesium-core/codec';

export const DIGIT_PLACEHOLDER = 'd';

export type PhoneNumberType = 'phone' | 'mobile';

export interface PhoneFormatErrors {
    tooShort?: boolean;
    tooLong?: boolean;
    syntaxError?: boolean;

}

function isDigit(char: string) {
    return !Number.isNaN(Number.parseInt(char));
}

export function phoneValidator(format: string) {
   let numExpectedDigits = phoneDigits(format);

    return function (phoneNumber: string): PhoneFormatErrors {
        if (phoneNumber === '') {
            // Empty input should be valid
            return null;
        }

        let numActualDigits = Array.from(phoneNumber)
            .filter(char => isDigit(char))
            .length;

        if (numActualDigits !== phoneNumber.length)
            return {syntaxError: true};

        if (numActualDigits > numExpectedDigits)
            return {tooShort: true};
        if (numActualDigits < numExpectedDigits)
            return {tooShort: true};

        return null;
    }
}

export function phoneDigits(format: string): number {
    return Array.from(format)
        .filter(char => char === DIGIT_PLACEHOLDER)
        .length;
}

export function phoneFormatter(format: string): (phone: string) => string {
    return (phone: string) => {
        if (phone === '') {
            // Add leading format characters _unless_ the input is empty
            return '';
        }

        let srcIndex = 0, formatted = '';
        for (let fmtIndex=0; fmtIndex<format.length; fmtIndex++) {
            let fmtChar = format[fmtIndex];

            if (fmtChar === DIGIT_PLACEHOLDER) {
                if (srcIndex >= phone.length) {
                    return formatted;
                }
                formatted += phone[srcIndex];
                srcIndex++;
            } else {
                formatted += fmtChar;
            }
        }

        return formatted;
    }
}

