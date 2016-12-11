import {Component, DebugElement, ViewEncapsulation} from '@angular/core';
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {CsDropdown, CsDropdownToggle} from './dropdown';
import {CsDropdownMenu, CsMenuAction} from './dropdown-menu';

@Component({
    selector: 'cs-dropdown-menu-host',
    template: `
    <cs-dropdown [open]="true">
        <button class="btn" csDropdownToggle>Save</button> 
    
        <cs-dropdown-menu (actionSelect)="appendAction($event)">
            <div class="dropdown-header">Dropdown heading</div>
            <button class="dropdown-item" [csMenuAction]="'actionOne'">Action 1</button>
            <button class="dropdown-item" [csMenuAction]="'actionTwo'">Action 2</button>
            <div class="dropdown-divider"></div>
            
            <button class="dropdown-item" [csMenuAction]="'actionThree'">Action 3</button>
        </cs-dropdown-menu>
    </cs-dropdown>
    `
})
export class DropdownMenuHost {
    actions: string[] = [];

    appendAction(action: string) {
        this.actions.push(action);
    }
}

describe('components.bootstrap.dropdown.dropdown-menu', () => {
    describe('DropdownMenu', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [
                    CsDropdown,
                    CsDropdownToggle,
                    CsDropdownMenu,
                    CsMenuAction,
                    DropdownMenuHost
                ]
            }).compileComponents();
        }));

        let fixture: ComponentFixture<DropdownMenuHost>;
        let dropdown: DebugElement;
        let dropdownMenu: DebugElement;

        beforeEach(() => {
            fixture = TestBed.createComponent(DropdownMenuHost);
            dropdown = fixture.debugElement.query(By.directive(CsDropdown));
            dropdownMenu = fixture.debugElement.query(By.directive(CsDropdownMenu));
        });

        it('should emit an action event if one of the menu items is clicked', async () => {
            await fixture.detectChanges();
            let menuItems = fixture.debugElement.queryAll(By.css('a.dropdown-item'));

            menuItems.forEach((menuItem: DebugElement) => {
                menuItem.triggerEventHandler('click', {});
            });

            await fixture.detectChanges();
            await fixture.whenStable();
            expect(fixture.componentInstance.actions).toEqual(['actionOne', 'actionTwo', 'actionThree']);
        });
    });
});
