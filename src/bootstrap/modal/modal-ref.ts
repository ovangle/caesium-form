import {Observable} from 'rxjs/Observable';

import {TemplateRef} from '@angular/core';
import {CsModalOutlet} from './modal-outlet';
import {CsModalOptions, CsModalDismissalReason} from './modals';


export class CsModalRef<T> {
    constructor(
        private _outlet: CsModalOutlet,
        public content: TemplateRef<T>,
        public options: CsModalOptions
    ) {}

    get dismissEvent(): Observable<CsModalDismissalReason> {
        return this._outlet.dismissEvent;
    }

    dismiss(): Promise<any> {
        return this._outlet.dismiss({type: 'template'});
    }
}
