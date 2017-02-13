import {EncodingException} from 'caesium-core/codec';
import {phoneValidator, phoneFormatter} from './phone_number';


describe('types.phone_number', () => {
    describe('phoneValidator', () => {
        let validator = phoneValidator('(dd) dddd dddd');
        it('should test.ts whether a phone number is the correct length ', () => {
            expect(validator('(02) 432')['tooShort']).toBeTruthy();
            expect(validator('(02) 1234 56789')['tooLong']).toBeTruthy();
        });

        it('should test.ts whether an invalid character is present in the input', () => {
            let validator = phoneValidator('(dd) dddd dddd');

            expect(validator('(02) A432 1234').syntaxError)
                .toBeTruthy();
            expect(validator('(02) 1234-4321').syntaxError)
                .toBeTruthy();
        });
    });

    describe('phoneFormatter', () => {
        it('should format a phone number', () => {
            let formatter = phoneFormatter('(dd) dddd dddd');

            expect(formatter('0212345678')).toEqual('(02) 1234 5678');

            expect(formatter('')).toEqual('', 'should return blank if the input is blank');

            expect(formatter('0123456')).toEqual('(01) 2345 6', 'Shorter inputs fill out as much of the input as possible');
            expect(formatter('0123456789000')).toEqual('(01) 2345 6789', 'Longer inputs should be truncated')
            expect(formatter('012345A')).toEqual('(01) 2345 ', 'Should stop at the first non-digit input');

            expect(formatter('01')).toEqual('(01', 'All literal format characters are appended to the string');
        });
    });
});
