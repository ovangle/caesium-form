import 'rxjs/add/observable/merge';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {
    forwardRef, Component, Directive, Input, Output, EventEmitter, ContentChildren, QueryList, Renderer
} from '@angular/core';

import {isDefined} from 'caesium-core/lang';

@Component({
    moduleId: module.id,
    selector: 'cs-dropdown-menu',
    template: `
    <ng-content></ng-content>
    `,
    host: {
        '[class.dropdown-menu]': 'true'
    },
    styleUrls: ['../bootstrap.css']
})
export class CsDropdownMenu {
    @Input() name: string;
    @Output() actionSelect = new EventEmitter<string>();

    private _actionSubscription: Subscription;

    @ContentChildren(forwardRef(() => CsMenuAction))
    private menuItems: QueryList<CsMenuAction>;

    ngAfterViewInit() {
        let actions = this.menuItems.toArray()
            .map(menuItem => menuItem.actionSelect);
        this._actionSubscription = Observable.merge<string>(...actions).subscribe(
            selectedAction => this.actionSelect.emit(selectedAction)
        );
    }

    ngOnDestroy() {
        if (isDefined(this._actionSubscription) && !this._actionSubscription.closed) {
            this._actionSubscription.unsubscribe();
        }
    }
}

@Directive({
    selector: 'button[csMenuAction]',
    host: {
        '(click)': 'actionSelect.emit(name)',
        '[class.disabled]': 'disabled'
    }
})
export class CsMenuAction {
    @Input() disabled: boolean;
    @Input('csMenuAction') name: string;
    @Output() actionSelect = new EventEmitter<string>();
}

