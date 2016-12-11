import 'rxjs/add/operator/filter';
import {Subscription} from 'rxjs/Subscription';

import {Map, Set} from 'immutable';

import {
    Component,
    Directive,
    Input,
    NgModule,
    ContentChild,
    ContentChildren,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ElementRef,
    QueryList,
    ViewContainerRef,
    TemplateRef
} from '@angular/core'
import {CommonModule} from '@angular/common';
import {FormControl, NgControl, NgModel} from '@angular/forms';

import {isDefined, isBlank} from 'caesium-core/lang';


/**
 * Displays error information if a control has validation errors.
 */
@Directive({
    selector: '[csIfInputError]',
    /*
    host: {
        '[class.help-block]': 'true'
    }
    */
})
export class CsIfInputError {
    @Input('csIfInputError') errorKey: string;

    private _hasView = false;

    constructor(private _viewContainer: ViewContainerRef, private _template: TemplateRef<Object>) {}

    displayHelp(control: NgControl): void {
        let displayHelp = !control.valid && control.errors[this.errorKey];
        if (displayHelp && !this._hasView) {
            this._hasView = true;
            this._viewContainer.createEmbeddedView(this._template);
        } else if (!displayHelp && this._hasView) {
            this._viewContainer.clear();
            this._hasView = false;
        }
    }
}

@Component({
    moduleId: module.id,
    selector: 'cs-form-group',
    template: `
    <div class="form-group"
         [ngClass]="{
            'row': isRow,
            'has-success': !isStatic && control?.valid,
            'has-danger': !isStatic && !control?.valid 
         }">     
         <div class="label-container"
            [ngClass]="{'col-sm-4': isRow}">
         
            <ng-content select="label"></ng-content>  
         </div>
        
        <div class="control-container"
            [ngClass]="{'col-sm-8': isRow}">
            <ng-content select="[ngModel], [formControl], [formControlName], p, .input-group"></ng-content>
            <ng-content></ng-content>
        </div>
        
    </div>
    `,
    styleUrls: ['bootstrap.css'],
    encapsulation: ViewEncapsulation.Native,
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

    public isFocused: boolean = false;
    private _controlValidity: Subscription;

    @ContentChild(NgControl) control: NgControl | undefined;
    @ContentChildren(CsIfInputError) helpBlocks: QueryList<CsIfInputError>;

    constructor(private _host: ElementRef) {}

    ngAfterViewInit() {
        if (!isBlank(this.control)) {
            this._controlValidity = this.control.statusChanges
                .filter(status => status === 'INVALID' || status === 'VALID')
                .subscribe(_ => this.updateHelpBlocks());
        }
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
        return !this.isStatic && this.control.touched && this.control.valid;
    }

    get hasErrors(): boolean {
        if (this.isStatic || !this.control.touched)
            return false;
        return Map(this.validationErrors)
            .some((value, key) => !this._warnings.has(key));
    }

    get hasWarning(): boolean {
        if (this.isStatic || !this.control.touched || this.control.valid)
            return false;
        return Map(this.validationErrors)
            .every((value, key) => this._warnings.has(key));

    }

    private get isRow(): boolean {
        return this._host.nativeElement.classList.contains('row');
    }

    get validationErrors(): {[err: string]: any} | null {
        return this.isStatic ? null : this.control.errors;
    }

    private updateHelpBlocks() {
        if (!this.isStatic) {
            this.helpBlocks.forEach(block => {
                block.displayHelp(this.control);
            });
        }

    }
}
