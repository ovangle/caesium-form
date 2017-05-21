import {Iterable, List, Set} from 'immutable';
import {Memoize} from 'typescript-memoize';


// The characters which require escaping in a regular expression.
const regexCharsRequireEscape = Set('.^$*+?()[{\\|');

export const enum CharMaskType {
    /// The value of this character should be reflected in the model
    Wildcard,

        /// This capture does not reflect
    Literal,

        /// The previous character is optional. Only present in intermediate parsing.
    _ModifierOptional
}

export interface CharMask {
    type: CharMaskType;
    literal?: string;
    pattern?: RegExp;
    optional?: boolean;
}

export function isLiteral(charMask: CharMask) { return charMask.type === CharMaskType.Literal; }
export function isWildcard(charMask: CharMask) { return charMask.type === CharMaskType.Wildcard; }



function parseCharMask(maskChar: string): CharMask {
    /// These chars are identical to the escaped regex counterparts.
    /// e.g. 'w' matches the same as '\w'
    if (/^[wWdDsSb]/.test(maskChar)) {
        return {type: CharMaskType.Wildcard, pattern: new RegExp(`\\${maskChar}`)};
    }

    /// A number represents the largest number in a character group
    /// e.g. '4' would represent the character class '[0-4]'
    if (/^\d/.test(maskChar)) {
        return {type: CharMaskType.Wildcard, pattern: new RegExp(`[0-${maskChar}]`)};
    }

    switch (maskChar) {
        /// '*' is the wildcard character
        case '*':
            return {type: CharMaskType.Wildcard, pattern: /./};

        case 'a':
            return {type: CharMaskType.Wildcard, pattern: /[a-z]/};

        case 'A':
            return {type: CharMaskType.Wildcard, pattern: /[A-Z]/};
    }

    if (maskChar === '?')
        return {type: CharMaskType._ModifierOptional};

    if (regexCharsRequireEscape.contains(maskChar)) {
        return {type: CharMaskType.Literal, literal: maskChar, pattern: new RegExp(`\\${maskChar}`)};
    }
    return {type: CharMaskType.Literal, literal: maskChar, pattern: new RegExp(maskChar)};
}

/// All the character sequences are parsed individually, so the optional modifiers
/// are inserted into the initially parsed sequence after the mask it applies to.
///
/// This function removes all the optional modifiers from the masks,
/// applying the modifier by setting the 'optional' tag in the
/// preceeding character mask
function applyCharMaskModifiers(charMasks: List<CharMask>): List<CharMask> {

    // Pair each char mask with the next one in sequence. If the next one is _ModifierOptional, mark it as
    // optional.
    let taggedCharMasks = charMasks.zip(charMasks.skip(1))
        .map(([charMask, successor]) => {
            return <CharMask>Object.assign({}, charMask, {
                optional: successor.type === CharMaskType._ModifierOptional
            });
        }).toList();

    // Tag and restore the last mask in sequence since it had no successor.
    taggedCharMasks = taggedCharMasks.push(Object.assign({}, charMasks.last(), {optional: false}));

    // Since they've been applied, remove all modifiers from the sequence.
    return taggedCharMasks.filter((mask) => mask.type !== CharMaskType._ModifierOptional).toList();
}

export function parseCharMasks(masks: List<string>): List<CharMask> {
    let charMasks = masks.map(m => parseCharMask(m));
    return applyCharMaskModifiers(charMasks.toList());
}


export interface InputMaskErrors {
    // The input did not match the mask
    mismatch?: boolean;
}

export class InputMask {

    constructor(
        /// Declaration of the mask to apply to the input
        private mask: string,
        /// Should literals be omitted from the model?
        public clean: boolean = false
    ) {}


    /// If the mask does not clean the model, then the model value
    /// will always be the same as the view value.
    get useViewModel(): boolean {
        return !this.clean;
    }

    modelOrViewModelToModel(modelOrViewModel: string): string {
        if (this.clean) {
            return modelOrViewModel;
        }
        return this.viewToModel(modelOrViewModel);
    }

    modelOrViewModelToView(modelOrViewModel: string): string {
        if (this.clean) {
            return this.modelToView(modelOrViewModel);
        }
        return modelOrViewModel;
    }

    //Uses the mask to construct a view from a valid model.
    modelToView(model: string): string {
        let modelChars = List(Array.from(model || ''));
        let charMasks = this.charMasks;

        let modelIndex = 0; let maskIndex = 0;

        let viewChars = List();

        while (modelIndex < modelChars.count() && maskIndex < this.charMasks.count()) {
            let charMask = this.charMasks.get(maskIndex++);

            switch (charMask.type) {
                case CharMaskType.Literal:
                    // A literal mask is always emitted to the view characters.
                    viewChars = viewChars.push(charMask.literal);

                    // If the input is not cleaned, then we are also consuming a value from the model
                    // skip it.
                    if (!this.clean) {
                        modelIndex++;
                    }
                    break;
                case CharMaskType.Wildcard:
                    if (charMask.optional) {
                        let numRemainingModelChars = modelChars.count() - (modelIndex + 1);
                        let numRemainingCaptures = this.charMasks.skip(maskIndex)
                            .filter((charMask) => {
                                // Only count literal characters if we don't clean the model.
                                return charMask.type === CharMaskType.Wildcard
                                    || (!this.clean && charMask.type === CharMaskType.Literal)
                            })
                            .count();

                        if (numRemainingModelChars < numRemainingCaptures) {
                            // There are not enough model characters to fill the captures.
                            // skip this optional mask character
                            break;
                        }
                    }
                    let modelChar = modelChars.get(modelIndex++);
                    viewChars = viewChars.push(modelChar);
                    break;
                default:
                    throw `Unexpected character mask type: ${charMask.type}`;
            }

        }

        return viewChars.join('');

    }


    viewToModel(view: string): string {
        let viewChars = List<string>(Array.from(view));
        return matchWildcards(this.charMasks, viewChars).matches.join('');
    }


    validateView(view: string): InputMaskErrors | null {
        if (this.validationPattern.test(view)) {
            return null;
        }
        return {mismatch: true};
    }

    viewIsValid(view: string) {
        return this.validateView(view) !== null;
    }


    /// Turns the mask configured for the InputMaskUpdater
    /// into a sequence of individual character masks.
    @Memoize()
    get charMasks(): List<CharMask> {
        return parseCharMasks(List<string>(Array.from(this.mask)));
    }

    get numWildcards(): number {
        return this.charMasks.filter(mask => mask.type === CharMaskType.Wildcard).count();
    }

    /// Creates a regular expression which is:
    //      * anchored to the start and end of the view; and
    ///     * matches each char

    @Memoize()
    get validationPattern(): RegExp {
        let charMaskPatterns = this.charMasks
            .map(mask => `${mask.pattern.source}${mask.optional ? '?' : ''}`);
        return new RegExp(`^${charMaskPatterns.join('')}$`);
    }

    toString() {
        return `InputMask: '${this.mask}'`;
    }
}



/**
 * Matches a sequence of character masks possibly containing optional masks
 * against a sequence of view characters.
 *
 * Using the example mask '(dd) d?ddd dddd'
 * It pivots the sequence around the optional character, generating two
 *  * a sequence if the mask is present in the match, '(dd) dddd dddd'
 *  * a sequence if the mask is omitted from the match '(dd) ddd dddd'
 *
 * If multiple optional characters are present, recursively analyzes
 * each sequence to obtain the matches.
 *
 * The sequences are then matched using `matchWildcardsNoOptionals
 *
 *
 * @param charMasks
 * @param viewChars
 * @returns {any}
 */
function matchWildcards(charMasks: Iterable<number, CharMask>, viewChars: Iterable<number,string>): WildcardSequenceMatch {
    if (charMasks.isEmpty() || viewChars.isEmpty())
        return {matches: List<string>(), unmatchedViewChars: viewChars};

    // For all mandatory masks at the front of the sequence, match the wildcards
    let initialRequiredMasks = charMasks.takeWhile(charMask => !charMask.optional);
    let initialMatch = matchWildcardsNoOptionals(initialRequiredMasks, viewChars);

    if (initialRequiredMasks.count() === charMasks.count()) {
        return initialMatch;
    }

    let unmatchedViewChars = initialMatch.unmatchedViewChars;

    let optionalIndex = initialRequiredMasks.count();
    let remainingMasksIfOmitted = charMasks.skip(optionalIndex + 1).toList();

    // Create a non-optional copy of the maskthat matches the same as the optional variant.
    let requiredMask = Object.assign({}, charMasks.get(optionalIndex), {optional: false});
    let remainingMasksIfPresent = remainingMasksIfOmitted.insert(0, requiredMask);

    let matchIfOmitted = matchWildcards(remainingMasksIfOmitted, unmatchedViewChars);
    let matchIfPresent = matchWildcards(remainingMasksIfPresent, unmatchedViewChars);

    if (matchIfPresent.matches.count() > matchIfOmitted.matches.count()) {
        return {
            matches: initialMatch.matches.concat(matchIfPresent.matches),
            unmatchedViewChars: matchIfPresent.unmatchedViewChars
        }
    } else {
        return {
            matches: initialMatch.matches.concat(matchIfOmitted.matches),
            unmatchedViewChars: matchIfOmitted.unmatchedViewChars
        }
    }
}

/**
 * Matches a group of character masks against a sequence of view characters.
 *
 * Each wildcard in the sequence is matched against the first remaining view character
 * that matches it.
 *
 * e.g. '(dd) dddd dddd' matched against '(A4) 12 34 14' would return the wildcard matches
 * '4123414'
 *
 * @param charMasks
 * @param viewChars
 * @returns {{matches: Iterable<number, string>, unmatchedViewChars: Iterable<number, string>}}
 * @private
 */
function matchWildcardsNoOptionals(charMasks: Iterable<number, CharMask>, viewChars: Iterable<number, string>): WildcardSequenceMatch {

    let wildcards = charMasks.filter(isWildcard);

    // Step 1. match each wildcard in charMasks, skipping any viewChars that don't match a mask
    // e.g. if mask: '(dd) dddd dddd' then wildcards:  'ddddddddd'
    // skip any view chars which don't match
    // So '(A2) 432 30894' would give wildcardMatches '243230894'

    let unmatchedViewChars = viewChars;
    let matches = wildcards
        .map(charMask => {
            unmatchedViewChars = unmatchedViewChars
                .skipWhile((viewChar) => !charMask.pattern.test(viewChar));

            let viewChar = unmatchedViewChars.first();
            unmatchedViewChars = unmatchedViewChars.skip(1);

            return viewChar;
        });

    return {matches, unmatchedViewChars};
}

interface WildcardSequenceMatch {
    matches: Iterable<number,string>;
    unmatchedViewChars: Iterable<number,string>;
}

