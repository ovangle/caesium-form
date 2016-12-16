import {EncodingException} from 'caesium-core/codec';
import {phoneValidator, phoneCodec} from './phone_number';


describe('types.phone_number', () => {
    describe('phoneValidator', () => {
        let validator = phoneValidator('(dd) dddd dddd');
        it('should test.ts whether a phone number is the correct length ', () => {
            expect(validator('(02) 432')['tooShort']).toBeTruthy();
            expect(validator('(02) 1234 56789')['tooLong']).toBeTruthy();
        });

        it('should test.ts whether an invalid character is present in the input', () => {
            expect(validator('(02) A432 1234')['invalidCharacter'])
                .toEqual([5, 'a digit', 'A']);
            expect(validator('(02) 1234-4321')['invalidCharacter'])
                .toEqual([9, '\' \'', '-']);
        });
    });

    describe('phoneCodec', () => {
        it('should decode a phone number', () => {
            let codec = phoneCodec('(dd) dddd dddd');

            expect(codec.decode('0212345678')).toEqual('(02) 1234 5678');
            expect(() => codec.decode('021456'))
                .toThrow(jasmine.any(EncodingException));

            expect(() => codec.decode('02123456789'))
                .toThrow(jasmine.any(EncodingException));

        });

        it('should encode a phone number', () => {
            let codec = phoneCodec('(dd) dddd dddd');
            expect(codec.encode('(01) 5432 1024')).toEqual('0154321024');

            expect(() => codec.encode('(05) A'))
                .toThrow(jasmine.any(EncodingException));
            expect(() => codec.encode('(08) 1234 69'))
                .toThrow(jasmine.any(EncodingException));
            expect(() => codec.encode('(08) 1234 567890'))
                .toThrow(jasmine.any(EncodingException));
        });

        it('should encode invalid values if raiseException is set to false', () => {
            let codec = phoneCodec('(dd) dddd dddd', {raiseExceptions: false});

            expect(codec.decode('')).toEqual('', 'should return blank if the input is blank');

            expect(codec.decode('0123456')).toEqual('(01) 2345 6', 'Shorter inputs fill out as much of the input as possible');
            expect(codec.decode('0123456789000')).toEqual('(01) 2345 6789', 'Longer inputs should be truncated')
            expect(codec.decode('012345A')).toEqual('(01) 2345 ', 'Should stop at the first non-digit input');

            expect(codec.decode('01')).toEqual('(01', 'All literal format characters are appended to the string');
        });

        it('should decode invalid values if raiseException is set to false', () => {
            let codec = phoneCodec('(dd) dddd dddd', {raiseExceptions: false});

            expect(codec.encode('(01) 5432 1024')).toEqual('0154321024');

            expect(codec.encode('')).toEqual('', 'should return blank if the input is blank');
            expect(codec.encode('(')).toEqual('', 'should return a blank string if the input contains only format characters');

            expect(codec.encode('(05) A'))
                .toEqual('05', 'Should stop at the first invalid character');
            expect(codec.encode('(08) 1234 69'))
                .toEqual('08123469', 'Should output partial strings');
            expect(codec.encode('(08) 1234 567890'))
                .toEqual('0812345678', 'should truncate input');
        });
    });
});
