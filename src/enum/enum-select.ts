import {forwardRef, Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {trigger, transition, style} from '@angular/animations';

import {isBlank} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';

import {proxyValueAccessor, ValueAccessorProxy} from '../input-proxy/value-accessor';
import {CsEnum} from './enum-meta';


@Component({
    moduleId: module.id,
    selector: 'cs-enum-select',
    template: `
        <select class="form-control"
            [formControl]="control"
            (blur)="_onTouched()">
            <option *ngFor="let value of enumType.values.toArray()" [ngValue]="value">
                {{enumType.displayValues.get(value)}} 
            </option>
        </select>
        
        <div *ngIf="isOtherSelected" [@showOtherInput]="isOtherSelected">
            <cs-icon *ngIf="isOtherSelected"
                name="exchange" [fixedWidth]="true"></cs-icon>
            <ng-content select="input" *ngIf="isOtherSelected" class="flex-1"></ng-content>
        </div>
    `,
    styleUrls: [`
    :host {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }    
    `],
    providers: [
        proxyValueAccessor(forwardRef(() => CsEnumSelect))
    ],
    animations: [
        trigger('showOtherInput', [
            transition(':enter', [
                style({width: '60%'})
            ]),
            transition(':leave', [
                style({width: '0%'})
            ])
        ])
    ]
})
export class CsEnumSelect<T> implements ValueAccessorProxy {
    @Input('enum') enumType: CsEnum<T>;

    control = new FormControl('');
    private _onTouched = () => {};

    registerOnTouched(fn: () => void) {
        this._onTouched = fn;
    }

    ngAfterViewInit() {
        if (isBlank(this.enumType))
            throw new ArgumentError('cs-enum-select: An enumerated type must be provided');
    }

    get isOtherSelected(): boolean {
        console.log('control value', this.control.value, this.enumType.isOtherValue(this.control.value));
        return this.enumType.isOtherValue(this.control.value);
    }
}

