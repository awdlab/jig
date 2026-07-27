import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { withDefaultIcons } from '@ngneers/controls/default-icons';
import { novaCoral } from '@ngneers/controls-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgnTab } from './tab';
import { NgnTabs } from './tabs';

// Tabs used as a pure navigation bar: headers only, no projected `#content`.
// A consumer drives routing off `(activeTabChange)` and reflects the URL back
// via `[activeTab]`. No empty tabpanel stubs must be emitted.
@Component({
  imports: [NgnTabs, NgnTab],
  template: `
    <ngn-tabs [activeTab]="active()" (activeTabChange)="active.set($event)">
      @for (t of items; track t.id) {
        <ngn-tab [tabId]="t.id">
          <ng-template #header>{{ t.label }}</ng-template>
        </ngn-tab>
      }
    </ngn-tabs>
  `,
})
class NavTabsHost {
  items = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Settings' },
  ];
  active = signal('overview');
}

describe('tabs as navigation (no tab content)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgnControls(
          { theme: { preset: novaCoral }, disableAnimations: true },
          withDefaultIcons()
        ),
      ],
    });
  });

  it('renders headers but no empty tabpanel wrappers', () => {
    const f = TestBed.createComponent(NavTabsHost);
    f.detectChanges();
    const host: HTMLElement = f.nativeElement;

    expect(host.querySelectorAll('[role="tab"]').length).toBe(2);
    // The whole point: contentless tabs emit zero panel stubs.
    expect(host.querySelectorAll('[role="tabpanel"]').length).toBe(0);
  });

  it('reflects external activeTab changes onto the header selection', () => {
    const f = TestBed.createComponent(NavTabsHost);
    f.detectChanges();
    const host: HTMLElement = f.nativeElement;

    const selected = () =>
      Array.from(host.querySelectorAll('[role="tab"]')).find(
        el => el.getAttribute('aria-selected') === 'true'
      );

    expect(selected()?.textContent?.trim()).toBe('Overview');

    f.componentInstance.active.set('settings');
    f.detectChanges();
    expect(selected()?.textContent?.trim()).toBe('Settings');
  });
});
