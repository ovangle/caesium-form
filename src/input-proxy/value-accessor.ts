import {Subscription} from 'rxjs/Subscription';

import {
    forwardRef,
    Inject, Injectable, InjectionToken,
    Provider,
    Type
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR, ControlValueAccessor,
    NG_VALIDATORS, Validator, ValidationErrors,
    AbstractControl, FormControl
} from '@angular/forms';

export interface ValueAccessorProxy {
    control: FormControl;

    // TODO: Remove this once https://github.com/angular/angular/issues/14433 is fixed.
    registerOnTouched(fn: () => void): void;

    // The component might already implement ngOnDestroy.
    // Wrap it if necessary
    ngOnDestroy?(): void;

}

export const CS_VALUE_ACCESSOR_PROXY = new InjectionToken('cs_value_accessor_proxy');

export function proxyValueAccessor<T>(type: Type<T>): Provider[] {
    return [
        {
            provide: CS_VALUE_ACCESSOR_PROXY,
            useExisting: type
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useClass: _ValueAccessor,
            multi: true
        }
    ];

}


/*
 * Proxies the implementation of CotnrolValueAccessor from @angular/forms
 * for a particular component.
 *
 * usage:
 *
 * @Component({
 *      ...
 *      providers: [
 *          {provide: CS_VALUE_ACCESSOR_PROXY, useExisting: forwardRef(() => MyComponent)},
 *          ProxiedControlValueAccessor.provider
 *      ]
 *  })
 *  export class MyComponent implements ValueAccessorProxy {
 *      control = new FormControl('');
 *      _onTouch = () => {};
 *
 *      registerOnTouched(fn: () => void) {
 *          this._onTouch = fn;
 *      }
 *  }
 *
 * @internal
 */
@Injectable()
export class _ValueAccessor implements ControlValueAccessor {

    private _valueChangeSubscription: Subscription;

    constructor(
        @Inject(CS_VALUE_ACCESSOR_PROXY) public proxy: ValueAccessorProxy
    ) {
        let onDestroy = proxy.ngOnDestroy ? proxy.ngOnDestroy : () => {};

        const self = this;
        proxy.ngOnDestroy = function () {
            onDestroy();
            if (self._valueChangeSubscription && self._valueChangeSubscription.closed) {
                self._valueChangeSubscription.unsubscribe();
            }
        }
    }

    writeValue(obj: any): void {
        let control = this.proxy.control;
        control.setValue(obj);
    }

    registerOnChange(fn: any): void {
        let control = this.proxy.control;
        this._valueChangeSubscription = control.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.proxy.registerOnTouched(fn);

    }
}

