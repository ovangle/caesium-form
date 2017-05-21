import {
    Inject,
    Injectable,
    InjectionToken,
    Provider,
    Type
} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    NG_VALIDATORS, Validator,
    ValidationErrors
} from '@angular/forms';

export interface ValidatorProxy {
    control: FormControl;
}

export const CS_VALIDATOR_PROXY = new InjectionToken('cs_validator_proxy');

export function proxyValidator<T>(type: Type<T>): Provider[] {
    return [
        {
            provide: CS_VALIDATOR_PROXY,
            useExisting: type
        },
        {
            provide: NG_VALIDATORS,
            useClass: _Validator,
            multi: true
        }
    ]

}


@Injectable()
class _Validator implements Validator {
    constructor(
        @Inject(CS_VALIDATOR_PROXY) public proxy: ValidatorProxy
    ) {}

    validate(control: AbstractControl): ValidationErrors {
        let _proxyControl = this.proxy.control;
        if (_proxyControl.validator) {
            return _proxyControl.validator(control);
        }
        return null;
    }

}
