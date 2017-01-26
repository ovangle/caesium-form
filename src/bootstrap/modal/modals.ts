import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/defer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

import {Injectable, TemplateRef, EventEmitter} from '@angular/core';

import {isDefined} from 'caesium-core/lang';

import {CsModalRef} from './modal-ref';
import {CsModalOutlet, ModalOutletDisplayState, ModalOutletException} from './modal-outlet';

export interface CsModalOptions {
    backdrop?: boolean;
    keyboard?: boolean;
    focus?: boolean;
}
export const modalOptionDefaults: CsModalOptions = {
    backdrop: true,
    keyboard: true,
    focus: true
};

export interface CsModalDismissalReason {
    /**
     * The type of dismissal
     * - 'backdrop': The user clicked on the backdrop
     * - 'keyboard': The user pressed the "Enter" or "Escape" keys
     * - 'template': The modal was dismissed by the template.
     */
    type: 'backdrop' | 'keyboard' | 'template';

    /**
     * The template which was dismissed.
     */
    content?: TemplateRef<any>;
}

@Injectable()
export class CsModals {
    private _outlet: CsModalOutlet;

    outletState = new EventEmitter<ModalOutletDisplayState>();
    dismissEvent = new EventEmitter<CsModalDismissalReason>();

    get hasOutlet(): boolean {
        return isDefined(this._outlet);
    }

    registerOutlet(outlet: CsModalOutlet) {
        if (isDefined(this._outlet)) {
            throw ModalOutletException.alreadyRegistered;
        }
        this._outlet = outlet;
        outlet.displayStateChange.subscribe((stateChange: ModalOutletDisplayState) => {
            this.outletState.emit(stateChange);
        });
        outlet.dismissEvent.subscribe((dismissal: CsModalDismissalReason) => {
            this.dismissEvent.emit(dismissal);
        });
    }

    display<T>(content: TemplateRef<T>, options?: CsModalOptions): Promise<CsModalRef<T>> {
        if (!this.hasOutlet)
            throw ModalOutletException.outletNotFound;
        return this._outlet.display(content, options);
    }
}



