import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/first';
import {Set} from 'immutable';

import {
    Directive,
    Component, Input, Output, EventEmitter, Host, ViewEncapsulation, ChangeDetectionStrategy,
    Renderer, ElementRef, ChangeDetectorRef
 } from '@angular/core';
import {CommonModule} from '@angular/common';


import {isDefined} from 'caesium-core/lang';

// TODO: Should be in caesium-core.
export function isPresent(value: boolean | "" | null): boolean {
    return value === "" || !!value;
}

export type CsDropdownState = 'closed' | 'open';

@Component({
    moduleId: module.id,
    selector: 'cs-dropdown',
    template: `
    <style>
    :host { display: block; } 
    </style> 
    <ng-content select="[csDropdownToggle]"></ng-content>
    
    <div class="dropdown-menu"
        [ngClass]="{
            'dropdown-menu-right': _classes.contains('align-right'),
            'dropdown-menu-left': _classes.contains('align-left')
        }">
        <ng-content></ng-content>
    </div> 
    `,
    host: {
        '[class.dropdown]': 'true',
        '[class.open]': '_open'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsDropdown {

    @Input('open') _open: boolean;
    @Output() stateChange = new EventEmitter<CsDropdownState>();

    constructor(
        private element: ElementRef,
        private _cd: ChangeDetectorRef
    ) {}

    open(): void{
        if (!this._open) {
            this._open = true;
            this.stateChange.emit('open');
            this._cd.markForCheck();
        }
    }

    close(): void {
        if (this._open) {
            this.stateChange.emit('closed');
            this._open = false;
            this._cd.markForCheck();
        }
    }

    closeIfNotMouseOver(mouseEvent: MouseEvent) {
        let eventPath = (mouseEvent as any).path;
        if (!eventPath.contains(this.element.nativeElement))
            this.close();
    }

    toggle(): void {
        return this._open ? this.close(): this.open();
    }

    get _classes() {
        return Set(this.element.nativeElement.classList);
    }
}

export type ToggleEventType = 'click';

@Directive({
    selector: '[csDropdownToggle]',
    host: {
        '[class.dropdown-toggle]': 'true',
        '(click)': 'click($event)'
    }
})
export class CsDropdownToggle {
    @Input('csDropdownToggle') _eventType: string;

    private _initMousePosition: {x: number, y: number};

    constructor(
        @Host() private dropdown: CsDropdown,
        private renderer: Renderer
    ) {}

    get eventType(): ToggleEventType {
        if (!isDefined(this._eventType) || this._eventType === "") {
            return 'click';
        }
        return <ToggleEventType>this._eventType;
    }


    private click(event: MouseEvent) {
        if (this.eventType === 'click') {
            this.dropdown.toggle();
        }
    }

}


