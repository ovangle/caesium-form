import 'rxjs/add/operator/filter';
import {Subscription} from 'rxjs/Subscription';

import {Map, Set} from 'immutable';

import {
    Component, Directive,
    Input,
    ContentChild,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ElementRef,
} from '@angular/core'
import {NgControl} from '@angular/forms';

import {isDefined, isBlank} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';

@Component({
    selector: 'cs-form-group',
    template: `
    <div class="form-group row"
         [ngClass]="{
            'has-success': hasSuccess,
            'has-warning': hasWarning,
            'has-danger': hasErrors
         }">     
        <div class="label-container col-xs-3">
            <ng-content select="label.col-form-label"></ng-content>  
        </div>
        
        <div class="input-container col-xs-6">
            <ng-content select="[ngModel], [formControl], [formControlName], p, .input-group"></ng-content> 
        </div>
        
        <div class="error-container col-xs-3">
            <ng-content select=".form-control-feedback"></ng-content>
        </div>
    </div>
    `,
    styleUrls: [
        'form-group.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsFormGroup {

    /**
     * Keys, which if present in the `validationErrors`, represent a
     * warning rather than an error.
     *
     *
     * @param keys
     */
    @Input('warnings')
    set warnings(keys: string[]) {
        this._warnings = Set<string>(keys);
    }
    private _warnings = Set<string>();

    private _controlValidity: Subscription;
    private _controlValid: boolean = false;

    @ContentChild(NgControl) control: NgControl | undefined;

    constructor(
        private _host: ElementRef,
        private _cd: ChangeDetectorRef
    ) {}

    ngAfterViewInit() {
        if (isBlank(this.control)) {
            throw new ArgumentError('A CsFormGroup must have a child which exports NgControl');
        }
        this._controlValidity = this.control.valueChanges.subscribe(status => {
            this._cd.markForCheck();
        });
    }

    ngOnDestroy() {
        if (isDefined(this._controlValidity) && !this._controlValidity.closed) {
            this._controlValidity.unsubscribe();
        }
    }

    get isStatic(): boolean {
        return !isDefined(this.control);
    }

    get hasSuccess(): boolean {
        // See https://github.com/angular/angular/issues/14433
        return !this.isStatic /* && this.control.touched */ && this.control.valid;
    }

    get hasErrors(): boolean {
        return !this.isStatic /* && this.control.touched */ && !this.control.valid
            && this.validationErrors.every(err => !this.isWarning(err));
    }

    get hasWarning(): boolean {
        return !this.isStatic /* && this.control.touched */ &&  !this.control.valid
            && this.validationErrors.every(err => !this.isWarning(err));
    }

    isWarning(err: string) {
        return this._warnings.has(err);
    }

    get validationErrors(): Map<string, any> | null {
        return this.isStatic ? null : Map(this.control.errors);
    }

}

