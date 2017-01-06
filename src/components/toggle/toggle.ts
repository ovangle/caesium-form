import {
    Directive, Input, Output, EventEmitter,
    OnInit, AfterViewInit,
    ElementRef, Renderer

} from '@angular/core';

import {isBlank} from 'caesium-core/lang';

export interface CsToggleOption {
    /// The value to be output via the containing `CsToggle`
    value: any;
    /// Is the option the active option? Used to set the initial active
    /// option and to reflect the active state.

    /// If `active` is false when `registerOnActivate` is called,
    /// the parent toggle will be deactivated, and will emit `null` as the active state.
    /// This can be used to implement an ON/OFF toggle.
    active: boolean;

    writeActive(active: boolean): void;
    registerOnActivate(fn: (value: CsToggleOption) => void): void;
}


/**
 * A toggle is the inverse of an `ngSwitch`. Rather than taking a value and
 * determining what to display, it's content is a sequence of `CsToggleOption`s
 * and outputs the active toggle value.
 *
 * The children of a toggle
 */
@Directive({
    selector: '[csToggle]',
    exportAs: 'csToggle'
})
export class CsToggle implements AfterViewInit {
    @Output('csToggle') activeChange = new EventEmitter<any>();
    _currentActive: CsToggleOption;

    // Should be called by every option's `ngOnInit` method.
    initOption(option: CsToggleOption) {
        if (option.active) {
            if (this._currentActive) {
                // If multiple children are active on initialization, only
                // write the last one.
                this._currentActive.writeActive(false);
            }
            this._currentActive = option;
        }

        option.registerOnActivate((option: CsToggleOption) => {
            if (!isBlank(this._currentActive)
                    && this._currentActive.value !== option.value) {
                this._currentActive.writeActive(false);
            }

            if (option.active) {
                this._currentActive = option;
                this.activeChange.emit(option.value);
            } else {
                this._currentActive = null;
                this.activeChange.emit(null);
            }

        });
    }

    ngAfterViewInit() {
        console.log('After view init');
        // Run this after initializing the view, so that any attached async pipes
        // are already initialized before emitting the first active option
        if (!isBlank(this._currentActive)) {
            this.activeChange.emit(this._currentActive.value);
        }
    }
}

/**
 * An anchor element which can be used as a toggleOption.
 * The value is determined by the href of the anchor.
 */
@Directive({
    selector: 'a[csToggleOption], button[csToggleOption]',
    host: {
        '(click)': '_onClick($event)',
        '[class.active]': 'active',
        '[class.disabled]': 'disabled'
    }
})
export class CsSimpleToggleOption implements CsToggleOption, OnInit {
    @Input('csToggleOption') value: any;

    // Is the option initially active.
    @Input() active: boolean;

    @Input() disabled: boolean = false;

    private _onActivate: Function;

    constructor(private toggle: CsToggle) {}

    writeActive(active: boolean) {
        this.active = active;
    }

    registerOnActivate(fn: (value: CsSimpleToggleOption) => void) {
        this._onActivate = fn;
    }

    private _onClick(event: MouseEvent) {
        if (!this.disabled) {
            this.active = true;

            if (this._onActivate) {
                this._onActivate(this);
            }
        }
        return false;
    }

    ngOnInit() {
        this.toggle.initOption(this);
    }
}

@Directive({
    selector: 'button[csToggleActive]',
    host: {
        '(click)': '_onClick($event)',
        '[class.active]': 'active'
    }
})
export class CsToggleActive implements CsToggleOption {
    value = true;

    @Input('csToggleActive') active: boolean;
    private _onActivate: Function;

    constructor(private toggle: CsToggle) {}

    ngOnInit() {
        this.toggle.initOption(this);
    }

    writeActive(active: boolean) {
        this.active = active;
    }

    registerOnActivate(fn: (option: CsToggleOption) => void) {
        this._onActivate = fn;
    }

    private _onClick(event: MouseEvent) {
        this.active = !this.active;
        if (this._onActivate) {
            this._onActivate(this);
        }
        return false;
    }
}

