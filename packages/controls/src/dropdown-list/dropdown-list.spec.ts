import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { JigDropdownList } from './dropdown-list';

import type { JigItem } from '@awdlab/jig/api';
import type { PopoverOptions } from '@awdlab/jig/popover';

const ITEMS: JigItem<unknown, string>[] = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
];

@Component({
  imports: [JigDropdownList],
  template: `
    <button #trigger type="button">Open</button>
    <jig-dropdown-list
      #dropdown
      inputId="dd"
      [anchor]="trigger"
      [items]="items()"
      [popoverOptions]="popoverOptions()"
      [closeOnSelect]="closeOnSelect()"
    >
      <span dropdownHeader data-testid="header">Header</span>
    </jig-dropdown-list>
  `,
})
class Host {
  public items = signal(ITEMS);
  public popoverOptions = signal<PopoverOptions>({});
  public closeOnSelect = signal(true);
  public dropdown = viewChild.required<JigDropdownList<typeof ITEMS>>('dropdown');
}

function setup() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return {
    fixture,
    host: fixture.componentInstance,
    dropdown: fixture.componentInstance.dropdown(),
  };
}

/**
 * Opens the list and waits for the list box's async filter to settle — its
 * `filteredItems` starts empty, so rows only exist after the first resolution.
 */
async function open(
  fixture: { detectChanges: () => void; whenStable: () => Promise<unknown> },
  dropdown: JigDropdownList<typeof ITEMS>
): Promise<void> {
  dropdown.show();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('jig-dropdown-list', () => {
  beforeEach(() => {
    // jsdom implements neither Element.scrollTo (the scroller uses it to bring the
    // highlighted row into view) nor the Popover API.
    Element.prototype.scrollTo ??= () => undefined;
    HTMLElement.prototype.togglePopover ??= function togglePopover(this: HTMLElement) {
      return true;
    };
    HTMLElement.prototype.showPopover ??= () => undefined;
    HTMLElement.prototype.hidePopover ??= () => undefined;

    TestBed.configureTestingModule({
      providers: [
        provideJigControls(
          { theme: { preset: nova }, disableAnimations: true },
          withDefaultIcons()
        ),
      ],
    });
  });

  it('starts closed and reports no displayed items', () => {
    const { dropdown } = setup();

    expect(dropdown.open()).toBe(false);
    expect(dropdown.displayedItems()).toEqual([]);
  });

  it('renders the list box and the projected header once opened', async () => {
    const { fixture, dropdown } = setup();

    await open(fixture, dropdown);

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('jig-list-box')).not.toBeNull();
    expect(root.querySelector('[data-testid="header"]')).not.toBeNull();
    expect(dropdown.displayedItems()).toHaveLength(3);
  });

  it('builds listbox and popover ids from inputId', async () => {
    const { fixture, dropdown } = setup();

    await open(fixture, dropdown);

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('#dd_listbox')).not.toBeNull();
    expect(root.querySelector('#dd_popover')).not.toBeNull();
  });

  it('leaves width unconstrained by default so the list is content-sized', () => {
    const { dropdown } = setup();

    expect(dropdown.appliedPopoverOptions().sizeConstraints?.width).toBeUndefined();
    expect(dropdown.appliedPopoverOptions().sizeConstraints?.maxHeight).toBe('700px');
    expect(dropdown.appliedPopoverOptions().cache).toBe(true);
  });

  it('merges caller popover options over the defaults', () => {
    const { fixture, host, dropdown } = setup();

    host.popoverOptions.set({ sizeConstraints: { width: 1, maxWidth: 1 } });
    fixture.detectChanges();

    expect(dropdown.appliedPopoverOptions().sizeConstraints?.width).toBe(1);
    expect(dropdown.appliedPopoverOptions().sizeConstraints?.maxWidth).toBe(1);
    expect(dropdown.appliedPopoverOptions().sizeConstraints?.maxHeight).toBe('700px');
  });

  it('forwards navigation keys to the list box', async () => {
    const { fixture, dropdown } = setup();

    await open(fixture, dropdown);
    dropdown.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();

    expect(dropdown.highlightedValue()).toBe('a');
    expect(dropdown.highlightedOptionId()).toBe('dd_listbox_option_a');
  });

  it('ignores navigation keys while closed', () => {
    const { dropdown } = setup();

    dropdown.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    expect(dropdown.highlightedValue()).toBeNull();
  });

  it('emits the clicked item and closes on select by default', async () => {
    const { fixture, dropdown } = setup();
    const clicked: string[] = [];
    dropdown.itemClicked.subscribe(value => clicked.push(value));

    await open(fixture, dropdown);

    const options = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[role="option"]'
    );
    options[1]?.click();
    fixture.detectChanges();

    expect(clicked).toEqual(['b']);
    expect(dropdown.value()).toBe('b');
    expect(dropdown.open()).toBe(false);
  });

  it('stays open on select when closeOnSelect is false', async () => {
    const { fixture, host, dropdown } = setup();
    host.closeOnSelect.set(false);
    fixture.detectChanges();

    await open(fixture, dropdown);

    const options = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      '[role="option"]'
    );
    options[2]?.click();
    fixture.detectChanges();

    expect(dropdown.value()).toBe('c');
    expect(dropdown.open()).toBe(true);
  });

  it('clears the highlight on request', async () => {
    const { fixture, dropdown } = setup();

    await open(fixture, dropdown);
    dropdown.onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(dropdown.highlightedValue()).toBe('a');

    dropdown.clearHighlight();
    fixture.detectChanges();

    expect(dropdown.highlightedValue()).toBeNull();
  });
});
