import {
    Component,
    Input
} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';

import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {proxyValueAccessor, ValueAccessorProxy} from '../input-proxy/value-accessor';
import {proxyValidator, ValidatorProxy} from '../input-proxy/validator';

function textInputValidator(c: AbstractControl) {
    let value = c.value;
}


@Component({
    selector: 'cs-date-input',
    template: `
    <div class="input-group">
        <span class="input-group-addon"><cs-icon [name]="'calendar'"></cs-icon></span>
        
        <input type="text" class="form-control" 
            csMaskedInput [csMask]="'3?1/1?9/9?9?99'"
            [formControl]="_textInputControl"
            (blur)="_onTouched()">
    </div>     
        
    <ngb-datepicker *ngIf="_isOpen"
                    #dp [formControl]="control"
                    [minDate]="minDate"
                    [maxDate]="maxDate"
                    [markDisabled]="markDisabled">
    </ngb-datepicker>
    `,
})
export class CsDateInput implements ValueAccessorProxy, ValidatorProxy {
    /**
     * The minimum date for picker navigation and validation.
     * If not provided, will be 10 years before `startDate`.
     */
    @Input() minDate: NgbDateStruct;

    /**
     * The maximum date for picker navigation and validation.
     * If not provided, will be 10 years after `startDate`
     */
    @Input() maxDate: NgbDateStruct;

    /**
     * Callback to mark a given date as disabled on the picker.
     */
    @Input() markDisabled: (date: NgbDateStruct, current: {year: number, month: number}) => boolean;

    control = new FormControl(null);

    private _textInput = new FormControl('');


    private _onTouched = () => {};
    private _isOpen: boolean = false;

    registerOnTouched(fn: () => void) {
        this._onTouched = fn;
    }


    /**
     * Open the date picker
     */
    open() {
        this._isOpen = true;
    }

}
