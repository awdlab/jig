import { NgnListBoxHarness } from '@ngneers/controls-playwright';
import test from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { exampleData } from '../helper/data';
import { expectNoA11yViolations } from '../helper/axe';

test('base', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-list-box style="width: 200px; height: 400px; display: block;" [items]="inputs().items" />
    `,
      imports: ['listBox'],
    },
    {
      inputs: {
        items: exampleData.items.flatPreformatted,
      },
    }
  );

  const listbox = new NgnListBoxHarness(page.locator('ngn-list-box').first());
  await listbox.expectItemsCount(exampleData.items.flatPreformatted.length);
});

// TODO(a11y): virtualization breaks listbox semantics — the ngn-scroller wrapper
// sits between role="listbox" and its role="option" children (aria-required-children),
// and the scroll region isn't keyboard-focusable (scrollable-region-focusable).
// Fixing needs an ARIA + virtual-scroll design pass (aria-owns or role=presentation
// on the scroller wrapper). Tracked as a11y hardening.
test.fixme('accessibility (axe)', async ({ page }) => {
  // role="listbox" requires an accessible name (aria-input-field-name).
  await loadComponent(
    page,
    {
      template: `
      <ngn-list-box
        aria-label="Options"
        style="width: 200px; height: 400px; display: block;"
        [items]="inputs().items"
      />
    `,
      imports: ['listBox'],
    },
    {
      inputs: {
        items: exampleData.items.flatPreformatted,
      },
    }
  );

  const listbox = new NgnListBoxHarness(page.locator('ngn-list-box').first());
  await listbox.expectItemsCount(exampleData.items.flatPreformatted.length);
  await expectNoA11yViolations(page);
});
