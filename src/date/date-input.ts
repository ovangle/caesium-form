import moment  from 'moment';

import {
    Component, Input, Output, EventEmitter,
    forwardRef,
    Directive,
    ViewChild,
    ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {isBlank} from 'caesium-core/lang';
import {CsDropdown} from '../bootstrap/dropdown/module';

const defaultAcceptFormats: Array<string> = [
    'DD/MM/YY',
    'DD/MM/YYYY',
    'DD MMM YYYY'
];

export interface DateInputErrors {
    [err: string]: any;

    required?: boolean;

    invalidDate?: boolean;
}


@Component({
    selector: 'cs-date-input',
    moduleId: module.id,
    template: `
    <cs-dropdown #dropdown class="align-right">

        <div class="input-group dropdown-trigger">
            <span class="input-group-addon">
                <cs-icon name="calendar"></cs-icon>
            </span>
            
            <input type="text" 
                class="form-control"
                [ngModel]="_dateText" (ngModelChange)="_dateTextChanged($event)"
                (blur)="touch.emit($event)">
                 
            <span class="input-group-btn">
                <button class="btn"
                    (click)="dropdown.toggle()">
                    Select <cs-icon name="caret-down"></cs-icon>     
                </button>
            </span>       
        </div>

        <div class="dropdown-content">
            <cs-date-picker 
                [date]="_moment" 
                (dateChange)="_dateSelected($event)"></cs-date-picker>
        </div>

    </cs-dropdown>
    `,
    styleUrls: ['date-input.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class CsDateInput {

    private _dateText: string;
    private _moment: moment.Moment;

    @Input() disabled: boolean = false;
    @Input() required: boolean = false;

    @Input('accept') _acceptFormats: Array<string>;

    @ViewChild('dropdown') private _dropdown: CsDropdown;

    /**
     * An array of accepted input formats. See the momentjs documentation
     * for acceptable input formats.
     *
     * @returns {Array<string>}
     */
    get acceptFormats(): Array<string> {
        if (isBlank(this._acceptFormats)) {
            return defaultAcceptFormats;
        }
        return this._acceptFormats;
    }

    @Input()
    get date(): Date {
        return isBlank(this._moment) ? null : this._moment.toDate();
    }
    set date(date: Date) {
        this._moment = isBlank(date) ? null : moment(date).utc().startOf('day');
        this._dateText = isBlank(this._moment) ? '' : this._moment.format('DD/MM/YYYY');
        this._cd.markForCheck();
    }
    @Output() dateChange = new EventEmitter<Date>();

    @Output() touch = new EventEmitter<any>();

    constructor(private _cd: ChangeDetectorRef) {}

    _dateSelected(moment: moment.Moment) {
        this._dropdown.close();
        this._moment = moment.clone();
        this._dateText = moment.format('DD/MM/YYYY');
        this.dateChange.emit(moment.toDate());
        this._cd.markForCheck();
    }

    private _dateTextChanged(input: string) {
        this._dateText = input;

        if (this._dateText === '') {
            this._moment = null;
            this.dateChange.emit(null);
        } else {
            let m = moment.utc(input, this.acceptFormats, true);
            if (m.isValid()) {
                this._moment = m;
                this.dateChange.emit(m.toDate());
            }
        }
    }

    get errors(): DateInputErrors | null {
        let errors: DateInputErrors = {};

        if (this.required && isBlank(this._moment)) {
            errors.required = true;
            return errors;
        }

        let m = moment.utc(this._dateText, this.acceptFormats, true);
        if (!m.isValid()) {
            return {invalidDate: true};
        }

        return null;
    }

    get isValid(): boolean {
        return this.errors === null;
    }
}

@Directive({
    selector: 'cs-date-input[ngModel], cs-date-input[formControlName], cs-date-input[ngModel]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CsDateInputValueAccessor),
            multi: true
        }
    ]
})
export class CsDateInputValueAccessor implements ControlValueAccessor {

    constructor(
        private dateInput: CsDateInput
    ) {}

    writeValue(obj: any): void {
        this.dateInput.date = obj;
    }

    registerOnChange(fn: any): void {
        this.dateInput.dateChange.subscribe(fn);
    }

    registerOnTouched(fn: any): void {
        this.dateInput.touch.subscribe(fn);
    }

}

