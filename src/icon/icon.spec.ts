
import {TestBed, async, inject, ComponentFixture} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';

import {ArgumentError} from 'caesium-core/exception';

import {CsIcon} from './icon';

describe('components.icon', () => {
    describe('CsIcon', () => {
        let fixture: ComponentFixture<CsIcon>;

        beforeEach(async(() => {
            TestBed
                .configureTestingModule({
                    imports: [CommonModule],
                    declarations: [CsIcon],
                })
                .compileComponents();

        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(CsIcon);
        });

        it('should display an icon inline', async(() => {
            fixture.componentInstance.name = 'save';
            fixture.detectChanges();
            expect(fixture.componentInstance.iconClasses.toArray())
                .toEqual(['fa', 'fa-save']);

            let icon = fixture.debugElement.query(By.css('span.fa.fa-save'));
            expect(icon).not.toBeNull('should display the icon');
        }));

        it('should apply all the classes of the host element', async(() => {
            fixture.componentInstance.name = 'phone';
            fixture.nativeElement.classList.add('fa-2x');
            fixture.detectChanges();

            let icon = fixture.debugElement.query(By.css('span.fa.fa-phone.fa-2x'))
        }));

        it('should throw if no name is set during ngOnInit', () => {
            expect(() => fixture.detectChanges())
                .toThrow();
        })


    });

});
