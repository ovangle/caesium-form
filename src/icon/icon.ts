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
    moduleId: module.id,
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
    @Input() fixedWidth: boolean;

    constructor(private _host: ElementRef) {}

    ngOnInit() {
        if (isBlank(this.name)) {
            throw new ArgumentError('Icon name must be provided');
        }
    }

    get iconClasses(): Set<string> {
        let s = Set.of('fa', `fa-${this.name}`)
        if (this.fixedWidth) {
            s.add('fa-fw');
        }
        return s;
    }
}

