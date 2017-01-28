import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CsModalRef} from './modal-ref';
import {CsModals, CsModalOptions, CsModalDismissalReason} from './modals';
import {CsModalOutlet} from './modal-outlet';
import {CsModalTemplate} from './modal-template';

export {
    CsModalRef, CsModalTemplate, CsModals, CsModalOutlet,
    CsModalOptions, CsModalDismissalReason
};

@NgModule({
    imports: [CommonModule],
    declarations: [
        CsModalOutlet,
        CsModalTemplate
    ],
    providers: [
        CsModals
    ],
    exports: [
        CsModalOutlet,
        CsModalTemplate
    ]
})
export class CsModalModule {
}
