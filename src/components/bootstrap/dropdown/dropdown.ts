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
    <ng-content select="[csDropdownToggle]"></ng-content>
    
    <div *ngIf="_open" 
        class="dropdown-menu"
        [ngClass]="{
            'dropdown-menu-right': _classes.contains('align-right'),
            'dropdown-menu-left': _classes.contains('align-left')
        }">
        <ng-content></ng-content>
    </div> 
    `,
    styleUrls: ['../bootstrap.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.Native
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


    /*
    private mousein(event: MouseEvent) {
        if (this._toggleEvent === 'mouseover' && !isDefined(this._initMousePosition)) {
            this.dropdown.open();
            this._initMousePosition = {x: event.clientX, y: event.clientY};

            let releaseHandler: Function;
            let mouseMove = Observable.fromEventPattern<MouseEvent>(
                (handler) => {
                    releaseHandler = this.renderer.listenGlobal('window', 'mousemove', handler)
                },
                (handler) => releaseHandler(handler)
            );

            // A section of width 30 degrees through which the mouse can travel
            // without closing the menu
            const THRESHOLD = Math.PI / 6;

            // Track the mouse movements towards the menu.
            // If the mouse moves
            let mouseMoveSubscription = mouseMove
                .debounceTime(50)
                .skipWhile(mouseEvent => {
                    let initPos= this._initMousePosition;
                    let currPos = {x: mouseEvent.clientX, y: mouseEvent.clientY};

                    let angle = Math.atan2(currPos.x - initPos.x, currPos.y - initPos.y);
                    return Math.abs(angle) > THRESHOLD;
                })
                .first()
                .subscribe((event: MouseEvent) => {
                    this.dropdown.closeIfNotMouseOver(event.target);

                });

        }
    }
    */
}


