import {
    forwardRef,
    Component,
    ChangeDetectionStrategy
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ValueAccessorProxy, proxyValueAccessor} from '../input-proxy/value-accessor';
import {ValidatorProxy, proxyValidator} from '../input-proxy/validator';

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
        <cs-icon [name]="'phone'" [fixedWidth]="true"></cs-icon>
    </span>
    <input type="tel" class="form-control"
            csMaskedInput [csMask]="'(99) 9999 9999'" [clean]="true"
            [formControl]="control"
            (blur)="_onTouched()">
    `,
    providers: [
        ...proxyValueAccessor(forwardRef(() => CsPhoneInput)),
        ...proxyValidator(forwardRef(() => CsPhoneInput))
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsPhoneInput implements ValueAccessorProxy, ValidatorProxy {
    private _onTouched = () => {};
    registerOnTouched(fn: ()=>void): void {
        this._onTouched = fn;
    }

    control = new FormControl('');
}

/**
 * Takes raw phone strings, consisting of an unbroken string of digits
 * and allows the user to input as if the value was a formatted localised
 * phone number.
 */
@Component({
    moduleId: module.id,
    selector: 'cs-mobile-phone-input',
    host: {
        '[class.input-group]': 'true'
    },
    template: `
    <span class="input-group-addon">
        <cs-icon [name]="'mobile'" [fixedWidth]="true"></cs-icon>
    </span>
    <input type="tel" class="form-control"
           csMaskedInput [csMask]="'9999 999 999'" [clean]="true"
           [formControl]="control"
           (blur)="_onTouched()">
    `,
    providers: [
        ...proxyValueAccessor(forwardRef(() => CsMobilePhoneInput)),
        ...proxyValidator(forwardRef(() => CsMobilePhoneInput))
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsMobilePhoneInput implements ValueAccessorProxy, ValidatorProxy {
    private _onTouched = () => {};
    control = new FormControl('');

    registerOnTouched(fn: () => void) {
        this._onTouched = fn;
    }
}


