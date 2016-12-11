import {Component, DebugElement} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {isDefined} from 'caesium-core/lang';

import {CsDropdown, CsDropdownToggle} from './dropdown';

@Component({
    selector: 'dropdown-host',
    template: `
    <style>
    .content {
        height: 200px; 
    }
    </style>

    <cs-dropdown id="hosted-dropdown" (open$)="handleOpen($event)">
        <button csDropdownToggle class="btn" id="dropdown-toggle">Dropdown</button>
        
        <div id="dropdown-content" class="content" >
            Lorem ipsum dolor amet
        </div>
    </cs-dropdown>
    
    `,
})
export class DropdownHost {


}

export function expectIsDropdownOpen(dropdown: DebugElement, open?: boolean) {
    open = !isDefined(open) || open;

    let content: DebugElement = dropdown.query(By.css('#dropdown-content'));
    expect(content).not.toBeNull('#dropdown-content should be distributed into the node');
    expect(content.nativeElement.textContent)
            .toMatch('Lorem ipsum dolor amet', '#dropdown-content should have existing content');
    if (open) {
        expect(dropdown.nativeElement.classList).toContain('open');
    } else {
        expect(dropdown.nativeElement.classList).not.toContain('open');
    }
}

describe('components.bootstrap.dropdown', () => {
    describe('Dropdown', () => {
        let fixture: ComponentFixture<DropdownHost>;
        let dropdown: DebugElement;
        let toggle: DebugElement;

        beforeEach(async (done) => {
            await TestBed.configureTestingModule({
                declarations: [
                    CsDropdown,
                    CsDropdownToggle,
                    DropdownHost
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(DropdownHost);
            dropdown = fixture.debugElement.query(By.css('#hosted-dropdown'));
            toggle = fixture.debugElement.query(By.css('#dropdown-toggle'));
            done();
        });

        it('should open and close when _using component instance methods', () => {
            fixture.detectChanges();
            dropdown.componentInstance.open();
            fixture.detectChanges();
            expectIsDropdownOpen(dropdown, true);

            dropdown.componentInstance.close();
            fixture.detectChanges();
            expectIsDropdownOpen(dropdown, false);
        });

        it('should toggle the dropdown if the toggle is clicked',() => {
            fixture.detectChanges();
            toggle.triggerEventHandler('click', {});
            fixture.detectChanges();
            expectIsDropdownOpen(dropdown, true);

            toggle.triggerEventHandler('click', {});
            fixture.detectChanges();

            expectIsDropdownOpen(dropdown, false);
        });

    });
});

