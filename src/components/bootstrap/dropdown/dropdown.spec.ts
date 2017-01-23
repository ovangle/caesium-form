import {Component, DebugElement} from '@angular/core';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {isDefined} from 'caesium-core/lang';

import {CsToggleModule} from '../../toggle/module';
import {CsDropdown} from './dropdown';

@Component({
    selector: 'dropdown-host',
    template: `
    <style>
    .content {
        height: 200px; 
    }
    </style>
    <cs-dropdown #dropdown id="hosted-dropdown"> 
        <button class="dropdown-trigger" (click)="dropdown.toggle()">Dropdown</button>
        <div id="dropdown-content" class="dropdown-content" >
            Lorem ipsum dolor amet
        </div>
    </cs-dropdown>
    `,
})
export class DropdownHost {}

@Component({
    selector: 'cs-dropdown-menu-host',
    template: `
    <cs-dropdown #dropdown [open]="true">
        <button class="dropdown-trigger" (click)="dropdown.toggle()">Menu</button>
    
        <div (csToggle)="appendAction($event)" class="dropdown-content">
            <div class="dropdown-header">Dropdown heading</div>
            <button class="dropdown-item" csToggleOption="actionOne">Action 1</button>
            <button class="dropdown-item" csToggleOption="actionTwo">Action 2</button>
            <div class="dropdown-divider"></div>
            
            <button class="dropdown-item" csToggleOption="actionThree">Action 3</button>
        </div>
    </cs-dropdown>
    `
})
export class DropdownMenuHost {
    actions: string[] = [];

    appendAction(action: string) {
        console.log('action', action);
        this.actions.push(action);
    }
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
                    DropdownHost
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(DropdownHost);
            dropdown = fixture.debugElement.query(By.css('#hosted-dropdown'));
            toggle = fixture.debugElement.query(By.css('.dropdown-trigger'));
            done();
        });

        it('should open and close when using component instance methods', () => {
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

    describe('DropdownMenu', () => {

        let fixture: ComponentFixture<DropdownMenuHost>;

        beforeEach(async(done) => {
            TestBed.configureTestingModule({
                imports: [CsToggleModule],
                declarations: [
                    CsDropdown,
                    DropdownMenuHost
                ]
            });
            await TestBed.compileComponents();
            fixture = TestBed.createComponent(DropdownMenuHost);
            done();
        });

        it('should emit an action event if one of the menu items is clicked', async (done) => {
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
            let menuItems = fixture.debugElement.queryAll(By.css('button.dropdown-item'));

            menuItems.forEach((menuItem: DebugElement) => {
                menuItem.triggerEventHandler('click', {});
                fixture.detectChanges();
            });

            fixture.detectChanges();
            expect(fixture.componentInstance.actions).toEqual(['actionOne', 'actionTwo', 'actionThree']);
            done();
        });
    });
});

