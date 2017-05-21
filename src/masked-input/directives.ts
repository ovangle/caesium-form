import {List} from 'immutable';

import {Subscription} from 'rxjs/Subscription';
import {Iterable} from 'immutable';


import {
    Directive, Input, Output, EventEmitter,
    forwardRef, Self,
    HostListener,
    Renderer2, ElementRef,

} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor, NG_VALUE_ACCESSOR,
    Validator, NG_VALIDATORS,
    ValidationErrors
} from '@angular/forms';

import {isLiteral, InputMask} from './model';


const csMaskValidator = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CsMaskValidator),
    multi: true
};

const csMaskControlValueAccessor = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CsMaskedInput),
    multi: true
};

@Directive({
    selector: '[csMask]',
    exportAs: 'csMask',
})
export class CsMask {
    @Input('csMask') _mask: string;
    @Input('clean') cleanModel: boolean;

    public mask: InputMask;

    ngOnInit() {
        this.mask = new InputMask(this._mask, this.cleanModel);
    }
}


@Directive({
    selector: 'input[csMask][csMaskedInput]',
    exportAs: 'csMask',
    providers: [
        csMaskControlValueAccessor,
    ],
    host: {
        '(input)': '_handleInput($event.target.value)',
        '(blur)': '_onTouched()'
    }
})
export class CsMaskedInput implements ControlValueAccessor {

    private _onChange = (_: any) => {};
    private _onTouched = () => {};

    constructor(private _renderer: Renderer2,
                private _elementRef: ElementRef,
                private csMask: CsMask
    ) { }

    get mask(): InputMask {
        return this.csMask.mask;
    }

    // Write the clean model value to the input, returning the value of the view.
    private _writeValue(model: string): string {
        let view = this._elementRef.nativeElement.value;
        let updatedView = this.mask.modelToView(model);

        let caretPosition = this._elementRef.nativeElement.selectionStart;
        console.log('caret position', caretPosition);

        while (caretPosition < this.mask.charMasks.count()
        && isLiteral(this.mask.charMasks.get(caretPosition))) {
            caretPosition++;
        }

        this._renderer.setProperty(this._elementRef.nativeElement, 'value', updatedView);
        this._renderer.setProperty(this._elementRef.nativeElement, '_modelValue', model);

        this._renderer.setProperty(this._elementRef.nativeElement, 'selectionStart', caretPosition + 1);
        this._renderer.setProperty(this._elementRef.nativeElement, 'selectionEnd', caretPosition + 1);

        return view;
    }


    writeValue(modelOrViewModel: string) {
        let model = this.mask.modelOrViewModelToModel(modelOrViewModel);
        this._writeValue(model);
    }

    registerOnChange(fn: (_: any) => void): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }

    _handleInput(view: string) {
        console.log('handle input');
        let model = this.mask.viewToModel(view);
        let updatedView = this._writeValue(model);

        if (this.mask.useViewModel) {
            this._onChange(updatedView);
        } else {
            this._onChange(model);
        }
    }
}

/**
 * If a mask is set on an input that is not decorated with csMask,
 * the validation is still injected into the existing controls
 * on the input.
 */
@Directive({
    selector: 'input[csMask]',
    providers: [csMaskValidator]
})
export class CsMaskValidator implements Validator {
    constructor(private csMask: CsMask) {}

    get mask(): InputMask { return this.csMask.mask; }

    validate(c: AbstractControl): ValidationErrors {
        let value = c.value;

        if (value === null || value === undefined || value === '') {
            return null;
        }

        let view = this.mask.modelOrViewModelToView(value);
        if (!this.mask.validationPattern.test(view)) {
            return { mismatch: true };
        }

        return null;
    }
}

