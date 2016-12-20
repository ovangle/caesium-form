import {CsEnum} from './enum-meta';

export type BasicEnum = 'OPTION_A' | 'OPTION_B' | 'OPTION_C';
export const BasicEnum = new CsEnum([
    {value: 'OPTION_A', display: 'Option A'},
    {value: 'OPTION_B', display: 'Option B'},
    {value: 'OPTION_C', display: 'Option C'}
]);

export type AllowNullEnum = BasicEnum | null;
export const AllowNullEnum = new CsEnum([
    {value: null, display: '-- None / Not disclosed --'},
    {value: 'OPTION_A', display: 'Option A'},
    {value: 'OPTION_B', display: 'Option B'},
    {value: 'OPTION_C', display: 'Option C'},
]);

export type AllowOtherEnum = BasicEnum | 'OTHER';
export const AllowOtherEnum= new CsEnum([
    {value: 'OPTION_A', display: 'Option A'},
    {value: 'OPTION_B', display: 'Option B'},
    {value: 'OPTION_C', display: 'Option C'},
    {value: 'OTHER', display: 'Other...', isOther: true}
]);


describe('components.enum.enum-meta', () => {
    it('should be able to get the display text for a value', () => {
        expect(BasicEnum.displayValues.get('OPTION_A')).toBe('Option A');
        expect(BasicEnum.displayValues.get('OPTION_C')).toBe('Option C');
        expect(AllowNullEnum.displayValues.get(null)).toBe('-- None / Not disclosed --');
    })

    it('should be nullable if it has a `null` value', () => {
        expect(BasicEnum.isNullable).toBe(false);
        expect(AllowNullEnum.isNullable).toBe(true);
    });

    it('should identify an OTHER value', () => {
        expect(AllowOtherEnum.isOtherValue(null)).toBe(false);
        expect(AllowOtherEnum.isOtherValue('OPTION_A')).toBe(false);
        expect(AllowOtherEnum.isOtherValue('OTHER')).toBe(true);
    });
});


