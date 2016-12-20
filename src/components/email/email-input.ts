import {Observable} from 'rxjs/Observable';

import {
    Injectable, forwardRef,
    ElementRef,
    Component, Input, Output, EventEmitter,
    ViewChild,
    ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR,
    AbstractControl, FormControl,
    Validators
} from '@angular/forms';

import {isDefined, isBlank} from 'caesium-core/lang';

import {CsIconModule} from '../icon/module';

export interface CsEmailInputErrors {
    required?: boolean;

    syntaxError?: string;
}

@Component({
    moduleId: module.id,
    selector: 'cs-email-input',
    template: `
    <div class="input-group">
        <span class="input-group-addon">
            <cs-icon name="envelope"></cs-icon> 
        </span>
        <input 
            #input 
            type="email" [formControl]="_control" 
            class="form-control"
            [formControl]="_control"
            (blur)="touch.emit($event)">
    </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useClass: forwardRef(() => EmailInputControlValueAccessor),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsEmailInput {
    @Input() required: boolean;

    @Input()
    get email(): string {
        return this._control.value;
    }
    set email(value: string) {
        this._control.setValue(value);
    }
    @Output()
    get emailChange(): Observable<string> {
        return <Observable<string>>this._control.valueChanges;
    }

    @Output() touch = new EventEmitter<any>();

    @ViewChild('input') private _input: ElementRef;
    private _control: FormControl;

    constructor() {
        function validate(control: AbstractControl): CsEmailInputErrors {
            if (this.required) {
                let errs = Validators.required(control);
                if (!isBlank(errs)) return errs;
            }
            if (isDefined(this._input)
                && !this._input.nativeElement.validity.valid
                && this._input.nativeElement.validity.typeMismatch
            ) {
                return {
                    syntaxError: this._input.nativeElement.validationMessage
                };
            }
            return null;
        }
        this._control = new FormControl('', validate.bind(this));
    }

    get isValid(): boolean {
        return this._control.valid;
    }

    get errors(): {[err: string]: any} {
        return this._control.errors;
    }
}

@Injectable()
export class EmailInputControlValueAccessor implements ControlValueAccessor {
    constructor(private emailInput: CsEmailInput) {}

    writeValue(email: string) {
        this.emailInput.email = email;
    }

    registerOnChange(fn: (email: string) => any): void {
        this.emailInput.emailChange.subscribe(fn);
    }

    registerOnTouched(fn: () => any) {
        this.emailInput.touch.subscribe(fn);
    }

}

