import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/first';
import {Set} from 'immutable';

import {
    Component, Input,
    ChangeDetectionStrategy, ChangeDetectorRef,
    ElementRef,
 } from '@angular/core';

import {CsToggle, CsToggleOption} from '../../toggle/module';

// TODO: Should be in caesium-core.
export function isPresent(value: boolean | "" | null): boolean {
    return value === "" || !!value;
}

export type CsDropdownState = 'closed' | 'open';

@Component({
    selector: 'cs-dropdown',
    template: `
    <style>
    :host { display: block; } 
    </style> 
    
    <ng-content select=".dropdown-trigger"></ng-content>
    
    <div class="dropdown-menu"
        [ngClass]="{
            'dropdown-menu-right': _classes.contains('align-right'),
            'dropdown-menu-left': _classes.contains('align-left')
        }">
        <ng-content 
            *ngIf="isOpen"
            select=".dropdown-content"></ng-content>
    </div> 
    `,
    host: {
        '[class.dropdown]': 'true',
        '[class.open]': 'isOpen'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsDropdown {

    @Input('open') isOpen: boolean = false;

    constructor(
        private element: ElementRef,
        private _cd: ChangeDetectorRef
    ) { }

    open(): void{
        if (!this.isOpen) {
            this.isOpen = true;
            this._cd.markForCheck();
        }
    }

    close(): void {
        if (this.isOpen) {
            this.isOpen = false;
            this._cd.markForCheck();
        }
    }

    closeIfNotMouseOver(mouseEvent: MouseEvent) {
        let eventPath = (mouseEvent as any).path;
        if (!eventPath.contains(this.element.nativeElement))
            this.close();
    }

    toggle() {
        if (this.isOpen) {
            this.close()
        } else {
            this.open();
        }
    }


    get _classes() {
        return Set(this.element.nativeElement.classList);
    }
}
