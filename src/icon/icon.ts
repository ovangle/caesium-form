import {Set} from 'immutable';

import {
    Component, Input,
    ChangeDetectionStrategy,
    ViewEncapsulation,
    ElementRef
} from '@angular/core';

import {isBlank} from 'caesium-core/lang';
import {ArgumentError} from 'caesium-core/exception';

@Component({
    moduleId: typeof module.id === "string" ? module.id : null,
    selector: 'cs-icon',
    host: {
        '[class]': '_hostClasses.join(" ")'
    },
    template: ` 
    <style>
        :host {
            display: inline-block; 
            font-size: inherit;
            contain: content;
        }
    </style>    
    <span [ngClass]="iconClasses.toObject()"></span>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsIcon {
    @Input() name: string;

    constructor(private _host: ElementRef) {}

    ngOnInit() {
        if (isBlank(this.name)) {
            throw new ArgumentError('Icon name must be provided');
        }
    }

    get _hostClasses(): Set<string> {
        if (isBlank(this._host.nativeElement))
            return Set<string>();
        return Set<string>(this._host.nativeElement.classList);
    }

    get iconClasses(): Set<string> {
        return this._hostClasses
            .union(Set.of('fa', `fa-${this.name}`));
    }
}

