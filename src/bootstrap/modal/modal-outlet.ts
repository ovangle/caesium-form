import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

import {
    forwardRef, Inject,
    TemplateRef, ElementRef, ChangeDetectorRef,
    Component, Output, EventEmitter,
    OnInit,
    ViewEncapsulation, ChangeDetectionStrategy,
    ViewChild,
    Renderer
} from '@angular/core';

import {isBlank} from 'caesium-core/lang';
import {Exception} from 'caesium-core/exception';

import {
    CsModals,
    CsModalOptions, modalOptionDefaults,
    CsModalDismissalReason
} from './modals';
import {CsModalRef} from './modal-ref';

export type ModalOutletDisplayState = 'showing' | 'shown' | 'hiding' | 'hidden';

/**
 * The outlet for modals.
 *
 * This is a full-page component, so needs to be attached to the
 * root of the application.
 *
 * [ModalService] is provided in order to populate the content
 * of the modal outlet with [ModalDialog] instances.
 *
 * Only one instance is supported at any time.
 */
@Component({
    moduleId: typeof module.id === "string" ? module.id : null,
    selector: 'cs-modal-outlet',
    template: `
    <div class="modal-backdrop fade" 
        *ngIf="hasContent"
        [ngClass]="{in: hasContent && isShown}"
        #backdrop>
    </div>

    <div class="modal fade" 
        tabindex="-1"
        *ngIf="hasContent" 
        [ngClass]="{ 
            'active': hasContent && isShown, 
            in: hasContent && isShown
        }"
        [style.display]="hasContent ? 'block' : 'none'"
        (transitionend)="_onTransitionEnd($event)" 
        #modalContainer
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <template [ngTemplateOutlet]="_content"></template>
            </div>
        </div>
    </div>
    `,
    host: {
        '(keyup)': '_onKeyUp($event)',
        '(click)': '_onClick($event)',

    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CsModalOutlet implements OnInit {
    private _content: TemplateRef<any> | null;
    private _options: CsModalOptions;
    private _isShown: boolean;
    private _isTransitioning: boolean;

    @ViewChild('modalContainer')
    private _modalContainer: ElementRef;

    @Output()
    displayStateChange = new EventEmitter<ModalOutletDisplayState>();
    @Output('dismiss')
    dismissEvent = new EventEmitter<CsModalDismissalReason>();

    constructor(
        @Inject(forwardRef(() => CsModals)) private modals: CsModals,
        private _cd: ChangeDetectorRef,
        private _renderer: Renderer
    ) {
        this._content = null;
        this._options = modalOptionDefaults;
        this._isShown = false;
        this._isTransitioning = false;
    }

    get hasContent(): boolean { return !isBlank(this._content); }
    get isShown(): boolean { return this._isShown; }
    get isTransitioning(): boolean { return this._isTransitioning; }

    get displayState(): ModalOutletDisplayState {
        if (this.isShown) {
            return this.isTransitioning ? 'showing': 'shown';
        } else {
            return this.isTransitioning ? 'hiding' : 'hidden';
        }
    }

    ngOnInit() {
        this.modals.registerOutlet(this);
    }

    setContent(content: TemplateRef<any>, options?: CsModalOptions) {
        options = Object.assign({}, modalOptionDefaults, options);

        if (this.isShown || this.isTransitioning) {
            throw ModalOutletException.setContentOfActiveModal;
        }

        this._content = content;
        this._options = options;
        this._cd.markForCheck();
    }

    async clearContent(): Promise<any> {
        if (this.isShown)
            throw ModalOutletException.setContentOfActiveModal;
        if (this.isTransitioning)
            await this.nextTransitionEnd();

        this._content = null;
        this._options = modalOptionDefaults;
        this._cd.markForCheck();
    }

    async show(): Promise<CsModalRef<any>> {
        if (this.isTransitioning)
            await this.nextTransitionEnd();

        if (this.isShown)
            return;

        if (!this.hasContent)
            throw ModalOutletException.templateRequired;

        this._setBodyOpen(true);

        //await new Promise((resolve) => requestAnimationFrame(resolve));
        this._isShown = true;
        this._isTransitioning = true;
        this.displayStateChange.emit(this.displayState);

        this.nextTransitionEnd().then((_) => {
            if (this._options.focus)
                this.focus()
        });
        this._cd.markForCheck();
        //await new Promise((resolve) => requestAnimationFrame(resolve));

        return new CsModalRef<any>(this, this._content, this._options);
    }

    async hide(): Promise<any> {
        if (this.isTransitioning)
            await this.nextTransitionEnd();

        if (!this.isShown)
            return;

        //await new Promise(resolve => requestAnimationFrame(resolve));
        this._setBodyOpen(false);
        this._isShown = false;
        this._isTransitioning = true;
        this.displayStateChange.emit(this.displayState);
        this._cd.markForCheck();
        //await new Promise(resolve => requestAnimationFrame(resolve));
    }

    focus() {
        if (!isBlank(this._modalContainer)) {
            this._renderer.invokeElementMethod(this._modalContainer.nativeElement, 'focus', []);
        }
    }

    private _onTransitionEnd() {
        this._isTransitioning = false;
        this.displayStateChange.emit(this.displayState);
    }

    private _onKeyUp(event: KeyboardEvent){
        if (!this._options.keyboard)
            return;

        if (event.key === 'Escape') {
            this.dismiss({type: 'keyboard'});
        }
    }

    private _onClick(event: MouseEvent) {
        if (!this._options.backdrop)
            return;
        // Path not in typescript Event
        let path: EventTarget[] = (event as any).path;

        function isModalContainer(element: Element) {
            return element.classList.contains('modal');
        }

        let shouldDismiss = !path.some((target: EventTarget) => {
            return 'classList' in target && isModalContainer(<Element>target);
        });

        if (shouldDismiss)
            this.dismiss({type: 'backdrop'});
    }

    /// Sets overflow: hidden on document.body, so that the background can't
    /// scroll when a modal is open
    _setBodyOpen(open: boolean) {
        this._renderer.setElementClass(document.body, 'modal-open', open);
    }

    nextTransitionEnd(): Promise<ModalOutletDisplayState> {
        switch (this.displayState) {
            case 'showing':
                return this.displayStateChange
                    .filter(state => state === 'shown')
                    .first().toPromise();
            case 'hiding':
                return this.displayStateChange
                    .filter(state => state === 'hidden')
                    .first().toPromise();
        }
        return Promise.resolve(this.displayState);
    }

    async display(template: TemplateRef<any>, options: CsModalOptions): Promise<CsModalRef<any>> {

        await new Promise(requestAnimationFrame);
        await this.setContent(template, options);

        // Explicitly run change detection so that content hidden by *ngIf
        // is visible before animating the modal.
        this._cd.detectChanges();

        await new Promise(requestAnimationFrame);
        return await this.show();
    }

    async dismiss(reason: CsModalDismissalReason): Promise<void> {
        reason.content = this._content;
        await new Promise(requestAnimationFrame);
        this.dismissEvent.emit(reason);
        await this.hide();
        // Explicitly run change detection so that content hidden by *ngIf
        // is visible before animating the modal.
        this._cd.detectChanges();
        await new Promise(requestAnimationFrame);
        await this.nextTransitionEnd();
        await this.clearContent();
        this._cd.detectChanges();
        await new Promise(requestAnimationFrame);
    }
}


export class ModalOutletException extends Exception {
    static outletNotFound = new ModalOutletException(
        'There must be a <cs-modal-outlet> registered for the application'
    );

    static alreadyRegistered = new ModalOutletException(
        'At most one <cs-modal-outlet> can exit in an application view'
    );

    static hasView = new ModalOutletException(
        'A <cs-modal-outlet> can only support at most one active dialog'
    );

    static templateRequired = new ModalOutletException(
        'The content of the modal is not set'
    );

    static setContentOfActiveModal = new ModalOutletException(
        'Cannot set content of <cs-modal-outlet> while existing modal is active'
    );

    constructor(message: string) {
        super(message);
    }
}
