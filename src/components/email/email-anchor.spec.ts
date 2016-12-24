import {Component, Input} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CsEmailAnchor} from './email-anchor';

@Component({
    selector: 'email-anchor-host',
    template: `
    <cs-email-anchor [email]="email" [displayText]="displayText"></cs-email-anchor>
    `
})
class CsEmailAnchorHost {
    @Input() email: string;
    @Input() displayText: string;
}

describe('components.email.email-anchor', () => {

    describe('CsEmailAnchor', () => {
        let fixture: ComponentFixture<CsEmailAnchorHost>;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                declarations: [
                    CsEmailAnchor,
                    CsEmailAnchorHost
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(CsEmailAnchorHost);
            done();
        });

        it('should send for the correct email href', () => {
            fixture.componentInstance.email = 'a@b.c';
            fixture.detectChanges();

            let _a = fixture.debugElement.query(By.css('a'));
            expect((_a.nativeElement as HTMLAnchorElement).getAttribute('href'))
                .toEqual('mailto:a@b.c');

        });


        it('should display the displayText if present, else the email', () => {
            fixture.componentInstance.email = 'hello@world.com';
            fixture.detectChanges();
            let _a = fixture.debugElement.query(By.css('a'));
            expect(_a.nativeElement.textContent).toEqual('hello@world.com');

            fixture.componentInstance.displayText = 'goodbye!';
            fixture.changeDetectorRef.detectChanges();
            fixture.detectChanges();
            expect(_a.nativeElement.textContent).toEqual('goodbye!');

        });
    });
});
