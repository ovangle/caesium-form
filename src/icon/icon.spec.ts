
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

        it('should display an item fixed width', () => {
            fixture.componentInstance.name = 'save';
            fixture.componentInstance.fixedWidth = true;
            fixture.detectChanges();

            expect(fixture.componentInstance.iconClasses.toArray())
                .toEqual(['fa', 'fa-save', 'fa-fw']);
            let icon = fixture.debugElement.query(By.css('span.fa.fa-save.fa-fw'));
            expect(icon).not.toBeNull('should display a fixed width icon');
        })

        it('should throw if no name is set during ngOnInit', () => {
            expect(() => fixture.detectChanges())
                .toThrow();
        });


    });

});
