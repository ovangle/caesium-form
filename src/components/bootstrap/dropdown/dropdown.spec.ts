import {Component, DebugElement} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
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
        <button csDropdownToggle id="dropdown-toggle">Dropdown</button>
        
        <div id="dropdown-content" class="content" >
            Lorem ipsum dolor amet
        </div>
    </cs-dropdown>
    
    <cs-dropdown id="open-dropdown" (open$)="handleOpen($event)"></cs-dropdown>
    `,
})
export class DropdownHost {


}

export function expectIsDropdownOpen(dropdown: DebugElement, open?: boolean) {
    open = !isDefined(open) || open;

    console.log('shadow root', dropdown.nativeElement.shadowRoot);
    let content = dropdown.nativeElement.shadowRoot.querySelector('#dropdown-content');
    if (open) {
        expect(content).not.toBeNull('#dropdown-content should be distributed into the node');
        expect(content.textContent).toMatch('Lorem ipsum dolor amet', '#dropdown-content should have existing content');
    } else {
        expect(content).toBeNull();
    }
}

describe('components.bootstrap.dropdown', () => {
    describe('Dropdown', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    CsDropdown,
                    CsDropdownToggle,
                    DropdownHost
                ]
            }).compileComponents();
        }));

        let fixture: ComponentFixture<DropdownHost>;
        let dropdown: DebugElement;
        let toggle: DebugElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(DropdownHost);
            dropdown = fixture.debugElement.query(By.css('#hosted-dropdown'));
            toggle = fixture.debugElement.query(By.css('#dropdown-toggle'));
        });

        it('should open and close when _using component instance methods', async(() => {
            fixture.detectChanges();
            dropdown.componentInstance.open();
            fixture.detectChanges();
            expectIsDropdownOpen(dropdown, true);

            dropdown.componentInstance.close();
            fixture.detectChanges();
            expectIsDropdownOpen(dropdown, false);
        }));

        it('should toggle the dropdown if the toggle is clicked',async(() => {
            fixture.detectChanges();
            toggle.triggerEventHandler('click', {});
            fixture.detectChanges();
            expectIsDropdownOpen(dropdown, true);

            toggle.triggerEventHandler('click', {});
            fixture.detectChanges();

            expectIsDropdownOpen(dropdown, false);

        }));

    });
});

