
import {ArgumentError} from 'caesium-core/exception';
import {EncodingException} from 'caesium-core/codec';

import {CsPhonePipe} from './phone-pipe';


describe('components.phone.phone-pipe', () => {
    describe('PhonePipe', () => {
        it('should format a phone ', () => {
            let phonePipe = new CsPhonePipe();

            expect(phonePipe.transform('0231421243', 'home'))
                .toEqual('(02) 3142 1243');

            expect(phonePipe.transform('0101230123', 'mobile'))
                .toEqual('0101 230 123');
        });

        it('should raise an exception if the phone number is invalid', () => {
            let phonePipe = new CsPhonePipe();

            expect(() => phonePipe.transform('0A', 'home'))
                .toThrow(jasmine.any(EncodingException));

            expect(() => phonePipe.transform('0123456789876', 'home'))
                .toThrow(jasmine.any(EncodingException));

            expect(() => phonePipe.transform('0212344321'))
                .toThrow(jasmine.any(ArgumentError));
        })
    });
});


