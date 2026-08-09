import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAwdControls } from '@awdlab/jig/api/ng';
import { withDefaultIcons } from '@awdlab/jig/default-icons';
import { nova } from '@awdlab/jig-themes/nova';
import { beforeEach, describe, expect, it } from 'vitest';

import { AwdTab } from './tab';
import { AwdTabs } from './tabs';

// Tabs used as a pure navigation bar: headers only, no projected `#content`.
// A consumer drives routing off `(activeTabChange)` and reflects the URL back
// via `[activeTab]`. No empty tabpanel stubs must be emitted.
@Component({
  imports: [AwdTabs, AwdTab],
  template: `
    <jig-tabs [activeTab]="active()" (activeTabChange)="active.set($event)">
      @for (t of items; track t.id) {
        <jig-tab [tabId]="t.id">
          <ng-template #header>{{ t.label }}</ng-template>
        </jig-tab>
      }
    </jig-tabs>
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
        provideAwdControls(
          { theme: { preset: nova }, disableAnimations: true },
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
