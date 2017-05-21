import {List} from 'immutable';
import {parseCharMasks, CharMaskType, InputMask} from './model';

describe('masked-input', () => {
    describe('CharMask', () => {
        describe('parseCharMasks', () => {
            it('should parse the valid wildcard characters', () => {
                let charMasks = parseCharMasks(List<string>('wWdDsSb0123456789*aA'));


                function expectWildcard(charMaskIndex: number, pattern: string): void {
                    let charMask = charMasks.get(charMaskIndex);
                    expect(charMask).toEqual({type: CharMaskType.Wildcard, pattern: pattern, optional: false});
                }

                expectWildcard(0, '\w');
                expectWildcard(1, '\W');
                expectWildcard(2, '\d');
                expectWildcard(3, '\D');
                expectWildcard(4, '\s');
                expectWildcard(5, '\S');
                expectWildcard(6, '\b');
                expectWildcard(7, '[0-0]');
                expectWildcard(8, '[0-1]');
                expectWildcard(9, '[0-2]');
                expectWildcard(10, '[0-3]');
                expectWildcard(11, '[0-4]');
                expectWildcard(12, '[0-5]');
                expectWildcard(13, '[0-6]');
                expectWildcard(14, '[0-7]');
                expectWildcard(15, '[0-8]');
                expectWildcard(16, '[0-9]');
                expectWildcard(17, '*');
                expectWildcard(18, '[a-z]');
                expectWildcard(18, '[A-Z]');
            });

            it('should parse some literal characters', () => {
                let literals= parseCharMasks(List<string>('.^$+()[{\\|q%F-'));

                function expectLiteral(charMaskIndex: number, literal: string, escaped: boolean = false) {
                    let charMask = literals.get(charMaskIndex);
                    let escapedPattern= (escaped ? '//' : '') + literal;

                    expect(charMask).toEqual({type: CharMaskType.Literal, literal: literal, pattern: escapedPattern, optional: false});
                }

                expectLiteral(0, '.', true);
                expectLiteral(1, '^', true);
                expectLiteral(2, '$', true);
                expectLiteral(3, '+', true);
                expectLiteral(4, '(', true);
                expectLiteral(5, ')', true);
                expectLiteral(6, '[', true);
                expectLiteral(7, '\\', true);
                expectLiteral(8, '|', true);
                expectLiteral(9, 'q');
                expectLiteral(9, '%');
                expectLiteral(0, 'F');

            })

            it('should apply optional modifiers', () => {
                let charMasks = parseCharMasks(List<string>('A?B??CDE?*4?'));

                function expectWildcard(charMaskIndex: number, pattern: string, optional = false) {
                    let charMask = charMasks.get(charMaskIndex);
                    expect(charMask).toEqual({type: CharMaskType.Wildcard, pattern: pattern, optional: optional})
                }

                function expectLiteral(charMaskIndex: number, literal: string, optional = false) {
                    let charMask = charMasks.get(charMaskIndex);
                    expect(charMask).toEqual({type: CharMaskType.Literal, literal: literal, pattern: literal, optional: optional});
                }

                expectLiteral(0, 'A', true);
                expectLiteral(1, 'B', true);
                expectLiteral(2, 'C', false);
                expectLiteral(3, 'D', false);
                expectLiteral(4, 'E', true);
                expectWildcard(5, '.', false);
                expectWildcard(6, '[0-4]', true)


            });
        });
    });

    describe('InputMask', () => {
        const phoneMask = new InputMask('(dd) dddd dddd', true);

        const dateMask = new InputMask('3?9-1?9-9?9?99', false);
        const moneyMask = new InputMask('$d?d?d?d.dd', false);


        it('should build an appropriate regex for the given mask', () => {
            let phoneMaskPattern = /^\(\d\d\) \d\d\d\d \d\d\d\d$/;
            expect(phoneMask.validationPattern.source).toEqual(phoneMaskPattern.source);

            let dateMaskPattern = /^[0-3]?[0-9]-[0-1]?[0-9]-[0-9]?[0-9]?[0-9][0-9]$/;
            expect(dateMask.validationPattern.source).toEqual(dateMaskPattern.source);

            let moneyMaskPattern = /^\$\d?\d?\d?\d?\d\.\d\d$/
            expect(dateMask.validationPattern.source).toEqual(moneyMaskPattern.source);
        });

        it('should be able to convert a model into a view', () => {

            function expectPhone(model: string, view: string, message: string = '') {
                expect(phoneMask.modelToView(model)).toEqual(view);
            }

            expectPhone('012345678901', '(01) 2345 6789', 'input too long');
            expectPhone('01234', '(01) 234', 'input too short');


            function expectDate(model: string, view: string, message: string = '') {
                expect(dateMask.modelToView(model)).toEqual(view, message);
            }

            expectDate('12111923', '12-11-1923', 'date model view correct length');
            expectDate('9465', '9-4-65', 'date model view optional characters');
            expectDate('946', '9-4-6', 'date model too few characters');
            expectDate('121119234', '12-11-1923', 'date model too many characters');

            function expectMoney(model: string, view: string, message: string = '') {
                expect(dateMask.modelToView(model)).toEqual(view, message);
            }

            expect('1000', )

        });

        it('should be possible to get the view and model from a viewModel', () => {
            // A "clean" mask has the viewmodel equal to the model.
            let model = '0123456789'; let view = '(01) 2345 6789';

            let viewModel = model;

            expect(phoneMask.modelOrViewModelToModel(model)).toEqual(model);
            expect(phoneMask.modelOrViewModelToModel(viewModel)).toEqual(model);

            expect(phoneMask.modelOrViewModelToView(model)).toEqual(view);
            expect(phoneMask.modelOrViewModelToView(viewModel)).toEqual(view);

            // An unclean mask has the viewmodel equal to the view.
            let dateModel = '31121912'; let dateView = '31-12-1912';
            let dateViewModel= view;

            expect(phoneMask.modelOrViewModelToModel(dateModel)).toEqual(dateModel);
            expect(phoneMask.modelOrViewModelToModel(dateViewModel)).toEqual(dateModel);

            expect(phoneMask.modelOrViewModelToView(dateModel)).toEqual(dateView);
            expect(phoneMask.modelOrViewModelToView(dateViewModel)).toEqual(dateView);
        });



    });

});
