import {Component, Input} from '@angular/core';

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CsSpinner} from './spinner';


describe('components.spinner.spinner', () => {
    describe('CsSpinner', () => {
        @Component({
            selector: 'cs-spinner-host',
            template: `
            <cs-spinner [size]="size"></cs-spinner>
            `
        })
        class CsSpinnerHost {
            @Input() size: string;
        }

        let fixture: ComponentFixture<CsSpinnerHost>;

        beforeEach(async (done) => {
            TestBed.configureTestingModule({
                declarations: [
                    CsSpinner,
                    CsSpinnerHost
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(CsSpinnerHost);

            done();
        });

        it('should have a width of 1em', () => {
            fixture.componentInstance.size = '14px';
            fixture.detectChanges();

            let spinner = fixture.debugElement.query(By.directive(CsSpinner));

            let spinnerElem = spinner.nativeElement as HTMLElement;

            expect(spinnerElem.clientWidth).toBe(14, 'width should be 1em');
            expect(spinnerElem.clientHeight).toBe(14, 'height should be 1em');

            fixture.componentInstance.size = '32px';
            fixture.detectChanges();

            expect(spinnerElem.clientWidth).toBe(32, 'width should be 1em');
            expect(spinnerElem.clientHeight).toBe(32, 'height should be 1em');
        });
    });
});
