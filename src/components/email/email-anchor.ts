import {
    Component, Input, ChangeDetectionStrategy,
} from '@angular/core';
import {isBlank} from 'caesium-core/lang';

@Component({
    selector: 'cs-email-anchor',
    template: `
    <style>
    :host { display: inline; } 
    </style>
    <a [href]="_href">{{displayText || email}}</a>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsEmailAnchor {
    @Input() email: string;
    @Input() displayText: string;

    private get _href(): string {
        return 'mailto:' + this.email;
    }

}
