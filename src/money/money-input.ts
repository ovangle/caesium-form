import {
    forwardRef,
    Inject,
    Component, Input, Output, EventEmitter,
    Directive
} from '@angular/core';
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms';

import {isBlank} from 'caesium-core/lang';
import {Codec} from 'caesium-core/codec';

import {Currency, CS_CURRENCY, moneyValidator, moneyDisplayCodec, CurrencyDisplayValidationErrors} from './money';

@Component({
    moduleId: typeof module.id === "string" ? module.id : null,
    selector: 'cs-money-input',
    template: `
    <style>
        :host {
            display: block;
            contain: content;
        }
    </style>      
    <div class="input-group">
        <span class="input-group-addon" [ngSwitch]="_useCurrencyIcon">
            <cs-icon *ngSwitchCase="true" name="currency.icon"></cs-icon>
            <span *ngSwitchDefault>{{currency.symbol}}</span>
        </span>
        <input type="text" class="form-control" 
            [ngModel]="_displayValue"
            (ngModelChange)="_inputChange($event)">
    </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useClass: forwardRef(() => CsMoneyInputControlValueAccessor)
        }
    ]
})
export class CsMoneyInput {
    private _displayValue: string;
    private _validator: Function;
    private _codec: Codec<number, string>;

    @Input()
    get money(): number {
        return this._codec.decode(this._displayValue);
    }
    set money(value: number) {
        this._displayValue = this._codec.encode(value);
    }
    @Output() moneyChange = new EventEmitter<number | null>();
    @Output() touch = new EventEmitter<any>();


    constructor(
        @Inject(CS_CURRENCY) private currency: Currency
    ) {
        this._validator = moneyValidator(this.currency);
        this._codec = moneyDisplayCodec(this.currency);
    }

    private get _useCurrencyIcon(): boolean {
        return !isBlank(this.currency.icon);
    }

    get errors(): CurrencyDisplayValidationErrors {
        let validator = moneyValidator(this.currency);
        return validator(this._displayValue) as CurrencyDisplayValidationErrors;
    }

    private _inputChange(input: string) {
        let validation = this._validator(input);
        if (isBlank(validation)) {
            this._displayValue = input;
        } else {
            this._displayValue = validation.suggest;
        }
    }
}

@Directive({
    selector: 'cs-money-input[ngModel]',
})
export class CsMoneyInputControlValueAccessor implements ControlValueAccessor {
    constructor(private moneyInput: CsMoneyInput) {}

    writeValue(obj: any): void {
        this.moneyInput.money = obj;
    }

    registerOnChange(fn: any): void {
        this.moneyInput.moneyChange.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.moneyInput.touch.subscribe(fn);
    }

}

