import {Observable} from 'rxjs/Observable';

import {
    Component, Directive, Input, Output, EventEmitter,
    TemplateRef, ElementRef
} from '@angular/core';

import {isDefined, isBlank} from 'caesium-core/lang';

import {CsModals, CsModalDismissalReason} from './modals';
import {CsModalRef} from './modal-ref';

/**
 * Usage of modals
 * ======
 *
 * 1. In the app root template, add an empty div with directive [csModalOutlet]
 * to the top level template.
 *
 * 2. In the component which should create the modal, create templates for the
 * content of the modal and obtain a template ref for the body and footer
 *
 * e.g.
 * @Component({
 *    template: `
 *      ...
 *      <div class="modals">
 *          <template #successBody>
 *              You did well
 *         </template>
 *         <template #successFooter>
 *             <button (click)="successConfirm()"></button>
 *         </template>
 *      </div>
 *      ....
 *  `})
 *  export class MyComponent {
 *      @ViewChild('successBody') successBody: TemplateRef;
 *
 *      constructor(private modals: ModalService) {}
 *  }
 *
 *  3. Activate the dialog
 *
 *  displaySuccess() {
 *      this.modalService.acitvate({
 *          body: this.successBody
 *      });
 *  }
 */

@Directive({
    selector: 'template[csModal]'
})
export class CsModalTemplate {
    /**
     * Dismiss the modal dialog when the `ESC` key is pressed
     *
     * Default is `true`.
     * @type {boolean}
     */
    @Input() keyboard: boolean = true;
    /**
     * Dismiss the modal dialog when clicking on the backdrop.
     *
     * Default is `true`
     *
     * @type {boolean}
     */
    @Input() backdrop: boolean = true;

    /**
     * Focus the modal dialog when activated
     *
     * Default is `true`
     *
     * @type {boolean}
     */
    @Input() focus: boolean = true;

    @Output('dismiss') get dismissEvent(): Observable<CsModalDismissalReason> {
        return this.modals.dismissEvent
            .filter(dismiss => dismiss.content === this.templateRef);
    }

    constructor(
        public templateRef: TemplateRef<any>,
        public modals: CsModals
    ) {}

    display(): Promise<CsModalRef<any>> {
        let options = {
            keyboard: this.keyboard,
            backdrop: this.backdrop,
            focus: this.focus
        };
        return this.modals.display(this.templateRef, options);
    }
}



