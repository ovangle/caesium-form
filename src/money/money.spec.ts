import {EncodingException} from 'caesium-core/codec';

import {Currency, moneyDisplayCodec, moneyValidator} from './money';

export const australianDollar: Currency = {
    symbol: '$',
    code: 'AUD',
    minorUnits: 2
};

describe('components.money.money', () => {
    describe('moneyDisplayValidator', () => {
        it('should invalidate empty inputs', () => {
            let validator = moneyValidator(australianDollar);
            expect(validator('')).toEqual({empty: true, suggest: ''});

            expect(validator(null)).toEqual({empty: true, suggest: ''});
        });

        it('should invalidate inputs with invalid characters', () => {
            let validator = moneyValidator(australianDollar);

            expect(validator('0A')).toEqual({
                currency: australianDollar,
                invalidChar: 1,
                suggest: '0'
            });

            expect(validator('4.2$')).toEqual({
                currency: australianDollar,
                invalidChar: 3,
                suggest: '4.2'
            });
        });

        it('should invalidate inputs which begin with a decimal separator', () => {
            let validator = moneyValidator(australianDollar);

            expect(validator('.42')).toEqual({
                currency: australianDollar,
                noMajorUnits: true,
                suggest: '0.42'
            });
        });

        it('should invalidate inputs with multiple decimal points', () => {
            let validator = moneyValidator(australianDollar);
            expect(validator('4.4.3')).toEqual({
                currency: australianDollar,
                multipleDecimalPoints: true,
                suggest: '4.4'
            });
        });

        it('should invalidate inputs with an incorrect number of minor units', () => {
            let validator = moneyValidator(australianDollar);
            let validation = validator('4.434');
            expect(validation['tooManyMinorUnits']).toBe(true);
            expect(validation['suggest']).toBe('4.43');

            validation = validator('4.2');
            expect(validation['tooFewMinorUnits']).toBe(true);
            expect(validation['suggest']).toBe('4.20');
        });

        it('should return null on valid input', () => {
            let validator = moneyValidator(australianDollar);
            expect(validator('4.20')).toBeNull();

        })
    });

    describe('moneyDisplayCodec', () => {

        it('should encode and decode money values', () => {
            let codec = moneyDisplayCodec(australianDollar);
            expect(codec.encode(40.39)).toBe('40.39');
            expect(codec.encode(1.2)).toBe('1.20');
            expect(codec.encode(100)).toBe('100.00');

            expect(codec.decode('84.21')).toBe(84.21);
        });

        it('should raise validation errors by default', () => {
            let codec = moneyDisplayCodec(australianDollar);

            expect(() => codec.encode(NaN))
                .toThrow(jasmine.any(EncodingException));
            expect(() => codec.encode(Infinity))
                .toThrow(jasmine.any(EncodingException));
        });

        it('should not raise validation errors if raiseException is false', () => {
            let codec = moneyDisplayCodec(australianDollar, {raiseException: false});

            expect(codec.encode(NaN)).toEqual('NaN');
            expect(codec.encode(Infinity)).toEqual('Infinity');

            expect(codec.decode(null)).toEqual(null);
            expect(codec.decode('')).toEqual(null);
        });

    });
});
