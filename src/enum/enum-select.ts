import {OrderedMap} from 'immutable';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {
    Injectable,
    Component, Input, Output, EventEmitter,
    ContentChild
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR, ControlValueAccessor, Validators,
    FormControl, AbstractControl, NgControl
} from '@angular/forms';

import {isBlank} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';

import {CsEnum} from './enum-meta';

@Component({
    moduleId: module.id,
    selector: 'cs-enum-select',
    template: `
    <div class="select-container">
        <select class="form-control"
            [ngModel]="value"
            (ngModelChange)="_onValueChange($event)"
            (blur)="touch.emit($event)">
            <option *ngFor="let value of enumType.values.toArray()" [ngValue]="value">
                {{enumType.displayValues.get(value)}} 
            </option>
        </select>
        
        <div class="other-input" *ngIf="isOtherSelected">
            <cs-icon name="exchange" [fixedWidth]="true"></cs-icon>
            <ng-content select=".form-control"></ng-content>
        </div>
    </div>
    `,
    styleUrls: ['enum-select.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useFactory: (enumSelect: CsEnumSelect<any>) => new EnumSelectControlValueAccessor(enumSelect),
            deps: [CsEnumSelect],
            multi: true
        }
    ]
})
export class CsEnumSelect<T> {
    @Input('enum') enumType: CsEnum<T>;
    @Input() value: T;

    /**
     * The value of the selected element has changed.
     * @returns {Observable<any>}
     */
    @Output() valueChange = new EventEmitter<T>();
    @Output() touch = new EventEmitter<any>();

    ngAfterViewInit() {
        if (isBlank(this.enumType))
            throw new ArgumentError('cs-enum-select: An enumerated type must be provided');
    }

    get isOtherSelected(): boolean {
        return this.enumType.isOtherValue(this.value);
    }

    private _onValueChange(value: T) {
        this.value = value;
        this.valueChange.emit(value);
    }
}


@Injectable()
class EnumSelectControlValueAccessor<T> implements ControlValueAccessor {
    constructor(private enumSelect: CsEnumSelect<T>) {}
    writeValue(obj: T): void { this.enumSelect.value = obj; }
    registerOnChange(fn: any): void { this.enumSelect.valueChange.subscribe(fn); }
    registerOnTouched(fn: any): void { this.enumSelect.touch.subscribe(fn); }
}

