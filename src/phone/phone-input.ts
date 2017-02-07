import {Observable} from 'rxjs/Observable';
import {
    Renderer,
    forwardRef, Injectable,
    Component, Input, Output, EventEmitter,
    ViewChild, ElementRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    FormControl, ValidatorFn, Validators, AbstractControl,
    ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms';

import {isBlank} from 'caesium-core/lang';
import {Codec} from 'caesium-core/codec';

import {
    PhoneNumber, phoneValidator, phoneCodec, DIGIT_PLACEHOLDER,
    PhoneLocalization, PhoneNumberType
} from './phone_number';

/**
 * Takes raw phone strings, consisting of an unbroken string of digits
 * and allows the user to input as if the value was a formatted localised
 * phone number.
 */
@Component({
    moduleId: module.id,
    selector: 'cs-phone-input',
    host: {
        '[class.input-group]': 'true'
    },
    template: `
    <span class="input-group-addon">
        <cs-icon [name]="icon" [fixedWidth]="true"></cs-icon>
    </span>
    <input #input name="phone" type="tel"
           class="form-control"
           [formControl]="_control"
           (keypress)="_phoneNumberChanged()"
           (blur)="touch.emit($event)">
    `,
    styleUrls: [
        'phone-input.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useClass: forwardRef(() => PhoneInputControlValueAccessor),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsPhoneInput {
    /**
     * Empty values for
     */
    @Input() required: boolean;


    private _type: PhoneNumberType;
    /**
     * The name of the icon to use on the phone input.
     * Values can be either 'phone' or 'mobile'
     */
    @Input()
    get type(): PhoneNumberType { return this._type; }
    set type(type: PhoneNumberType) {
        this._type = type;
        this._phoneNumberChanged();
    }

    /**
     * A stream of blur events
     */
    @Output() touch = new EventEmitter<string>();

    @Input()
    set disabled(value: any) {
        value ? this._control.disable() : this._control.enable();
    }

    @Input()
    get phone(): string { return this._codec.encode(this._control.value); }
    set phone(value: string) {
        let phone = this._codec.decode(value);
        this._control.setValue(phone);
    }

    @Output()
    get phoneChange(): Observable<string> {
        return <Observable<PhoneNumber>>this._control.valueChanges
            .map(value => this._codec.encode(value));
    }

    get isValid(): boolean {
        return !isBlank(this._control) && this._control.valid;
    }

    get errors(): ({[error: string]: any} | null) {
        return this._control.errors;
    }

    get icon(): string {
        if (isBlank(this.type))
            return 'none';
        return this.type === 'home' ? 'phone' : 'mobile';
    }

    @ViewChild('input') private _inputElement: ElementRef;
    private _control: FormControl;

    constructor(
        private _renderer: Renderer,
        private l10nService: PhoneLocalization) {
        function validate(control: AbstractControl) {
            if (this.required) {
                let errs = Validators.required(control);
                if (!isBlank(errs)) return errs;
            }
            return phoneValidator(this.format)(control.value || '');
        }

        this._control = new FormControl('', validate.bind(this));
    }

    _phoneNumberChanged() {
        if (this._control.disabled) {
            return true;
        }

        let caretPosition = this._inputElement.nativeElement.selectionStart;
        let caretAtEnd = false;

        let value = this._inputElement.nativeElement.value;
        if (caretPosition === value.length) {
            caretAtEnd = true;
        }

        let codec = this._codec;
        value = codec.decode(codec.encode(value));
        this._control.setValue(value, {emitEvent: true});

        if (caretAtEnd) {
            caretPosition = value.length;
        }
        this._renderer.invokeElementMethod(
            this._inputElement.nativeElement,
            'setSelectionRange',
            [caretPosition, caretPosition]
        );
        this._renderer.invokeElementMethod(
            this._inputElement.nativeElement,
            'focus'
        );
        return true;
    }

    get format(): string {
        return this.l10nService.getFormat(this.type);
    }

    private get _codec(): Codec<string,PhoneNumber> {
        return phoneCodec(this.format, {raiseExceptions: false});
    }
}

@Injectable()
export class PhoneInputControlValueAccessor implements ControlValueAccessor {
    constructor(private phoneInput: CsPhoneInput) {}

    writeValue(obj: string | null): void {
        this.phoneInput.phone = obj || '';
    }

    registerOnChange(fn: (phone: string) => any): void {
        this.phoneInput.phoneChange.subscribe(fn);
    }

    registerOnTouched(fn: Function): void {
        this.phoneInput.touch.subscribe(fn);
    }
}
