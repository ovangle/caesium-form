import {
    Component, Input,
    ChangeDetectionStrategy
} from '@angular/core';


@Component({
    selector: 'cs-spinner',
    moduleId: module.id,
    template: `
    <div class="loader"></div>
    `,
    host: {
        '[style.font-size]': 'size || \'inherit\''
    },
    styleUrls: [
        './spinner.css'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsSpinner {
    _defaultColor = 'rgb(255,255,255,0.2)';

    // A css indicator for the size. If not provided, defaults to
    // the current font size.
    @Input() size: string;
}

