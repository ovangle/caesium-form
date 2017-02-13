import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {
    Renderer,
    forwardRef, Injectable,
    Component, Input, Output, EventEmitter,
    ViewChild, ElementRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms';

import {isBlank} from 'caesium-core/lang';
import {Codec} from 'caesium-core/codec';

import {
    PhoneNumberType, phoneValidator, phoneFormatter, phoneDigits
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
           (keydown)="_keyDown($event)"
           (blur)="touch.emit($event)"
           [attr.disabled]="disabled">
    `,
    styleUrls: [
        'phone-input.css'
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
    @ViewChild('input') private _inputElement: ElementRef;

    /**
     * A stream of blur events
     */
    @Output() touch = new EventEmitter<string>();

    @Input() disabled: boolean;

    private _phone: string;

    @Input()
    get phone(): string {
        return this._phone;
    }
    set phone(value: string) {
        this._phone = value.replace(/\D/g, '');
    }

    /**
     * The name of the icon to use to represent the type of phoen number
     *
     * Values are either 'phone' or 'mobile';
     */
    @Input()
    icon: PhoneNumberType;

    @Input()
    format: string;

    @Output() phoneChange = new EventEmitter<string>();

    get isValid(): boolean {
        return isBlank(phoneValidator(this.format)(this._phone));
    }

    get errors(): ({[error: string]: any} | null) {
        return phoneValidator(this.format);
    }


    constructor(private _renderer: Renderer) {}

    _keyDown(event: KeyboardEvent) {
        let rawValue = this._inputElement.nativeElement.value;
        let phoneStart = rawValue.substring(
            0,
            this._inputElement.nativeElement.selectionStart
        ).replace(/\D+/g, '');
        let phoneEnd = rawValue.substring(
            this._inputElement.nativeElement.selectionEnd,
            Infinity
        ).replace(/\D+/g, '');


        if (/\d/.test(event.key)) {
            this._phone = this._phone + event.key;
        } else {
            return true;
        }

        this._phone = this._phone.substr(0, phoneDigits(this.format));

        console.log('new phone', phoneFormatter(this.format)(this._phone));

        this._renderer.setElementProperty(
            this._inputElement.nativeElement,
            'value',
            phoneFormatter(this.format)(this._phone)
        );
        this.phoneChange.emit(this._phone);
        return false;
    }

    /*
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
    */
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
