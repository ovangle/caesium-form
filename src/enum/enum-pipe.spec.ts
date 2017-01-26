import {ArgumentError} from 'caesium-core/exception';

import {CsEnumPipe} from './enum-pipe';

import {BasicEnum, AllowOtherEnum} from './enum-meta.spec';

describe('components.enum.enum-pipe', () => {
    describe('CsEnumPipe', () => {
        let pipe = new CsEnumPipe();
        it('should format a value', () => {
            expect(pipe.transform('OPTION_A', BasicEnum)).toEqual('Option A');
            expect(pipe.transform('OPTION_F', BasicEnum)).toEqual('OPTION_F', 'Unknown values should pass through unchanged')
            expect(
                () => pipe.transform('OPTION_A', AllowOtherEnum)
            ).toThrow(jasmine.any(ArgumentError));
            expect(pipe.transform('OPTION_A', AllowOtherEnum, 'other description')).toEqual('Option A');
            expect(pipe.transform('OTHER', AllowOtherEnum, 'other description')).toEqual('Other (other description)');
        })

    })
});
