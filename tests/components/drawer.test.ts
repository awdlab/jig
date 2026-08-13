import test, { expect } from '@playwright/test';
import { JigDrawerHarness } from '@awdlab/jig-playwright';

import { expectOutput, loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const MODEL_TEMPLATE = `
  <jig-drawer
    [open]="inputs().open"
    [modal]="inputs().modal"
    [header]="inputs().header"
    [position]="inputs().position"
    [closeBy]="'any'"
    (openChange)="output('open', $event)"
    (closed)="output('closed', true)"
  >
    Drawer body
  </jig-drawer>
`;

test('modal drawer is a labelled dialog with aria-modal', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: MODEL_TEMPLATE, imports: ['drawer'] },
    {
      inputs: { open: true, modal: true, header: 'Filters', position: 'start' },
    }
  );

  const drawer = new JigDrawerHarness(page.locator('jig-drawer'));
  await drawer.expectOpened();
  await drawer.expectModal();
  await drawer.expectPosition('start');
  await expect(drawer.headerText).toHaveText('Filters');

  const labelId = await drawer.locator.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  await expect(page.locator(`#${labelId}`)).toHaveText('Filters');

  // handle referenced so the fixture stays alive for the assertions above.
  expect(handle).toBeTruthy();
});

test('non-modal drawer is a complementary landmark without aria-modal', async ({ page }) => {
  await loadComponent(
    page,
    { template: MODEL_TEMPLATE, imports: ['drawer'] },
    {
      inputs: { open: true, modal: false, header: 'Filters', position: 'start' },
    }
  );

  const drawer = new JigDrawerHarness(page.locator('jig-drawer'));
  await drawer.expectModal(false);
  await expect(drawer.locator).not.toHaveAttribute('aria-modal', /.*/);
});

test('opens/closes via the open model and emits closed', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: MODEL_TEMPLATE, imports: ['drawer'] },
    {
      inputs: { open: false, modal: false, header: 'Filters', position: 'start' },
    }
  );

  const drawer = page.locator('jig-drawer');
  await expect(drawer).toBeHidden();

  await handle.setInputs({ open: true, modal: false, header: 'Filters', position: 'start' });
  await expect(drawer).toBeVisible();

  await handle.setInputs({ open: false, modal: false, header: 'Filters', position: 'start' });
  await expect(drawer).toBeHidden();
  await expectOutput(handle, 'closed', [true]);
});

test('position is reflected on the host', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: MODEL_TEMPLATE, imports: ['drawer'] },
    {
      inputs: { open: true, modal: true, header: 'Filters', position: 'end' },
    }
  );

  await expect(page.locator('jig-drawer')).toHaveAttribute('data-position', 'end');

  await handle.setInputs({ open: true, modal: true, header: 'Filters', position: 'bottom' });
  await expect(page.locator('jig-drawer')).toHaveAttribute('data-position', 'bottom');
});

test('modal drawer traps focus and restores focus to the opener on Escape', async ({ page }) => {
  const handle = await loadComponent(page, {
    template: `
        <button id="opener" (click)="drawer.show()">Open drawer</button>
        <jig-drawer
          #drawer
          [modal]="true"
          [closeBy]="'any'"
          (openChange)="output('open', $event)"
          (closed)="output('closed', true)"
        >
          <button id="first-btn">First</button>
          <button id="last-btn">Last</button>
        </jig-drawer>
      `,
    imports: ['drawer'],
  });

  const opener = page.locator('#opener');
  const drawer = page.locator('jig-drawer');

  // Whether DOM focus currently rests inside the drawer. Asserted against the
  // trap's contract (containment) rather than a specific element, since the
  // drawer also renders its own header close button as a focusable child.
  const focusInDrawer = () => page.evaluate(() => !!document.activeElement?.closest('jig-drawer'));

  await opener.click();
  await expect(drawer).toBeVisible();

  // Focus moved off the opener and into the drawer.
  await expect.poll(focusInDrawer).toBe(true);
  await expect(opener).not.toBeFocused();

  // Tab / Shift+Tab keep focus trapped inside the drawer — it never escapes to
  // the opener or the document body behind the modal.
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    expect(await focusInDrawer()).toBe(true);
  }
  await page.keyboard.press('Shift+Tab');
  expect(await focusInDrawer()).toBe(true);

  // Escape closes the drawer (popover auto-dismiss) and restores the opener.
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expectOutput(handle, 'open', [true, false]);
  await expect(opener).toBeFocused();
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    { template: MODEL_TEMPLATE, imports: ['drawer'] },
    { inputs: { open: true, modal: true, header: 'Filters', position: 'start' } }
  );
  await expect(page.locator('jig-drawer')).toBeVisible();
  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    { template: MODEL_TEMPLATE, imports: ['drawer'] },
    { inputs: { open: true, modal: true, header: 'Filters', position: 'start' } }
  );

  await test.step('start', async () => {
    await expect(page.locator('jig-drawer')).toBeVisible();
    await expectScreenshot(page, testInfo, 'start');
  });

  await test.step('end', async () => {
    await handle.setInputs({ open: true, modal: true, header: 'Filters', position: 'end' });
    await expectScreenshot(page, testInfo, 'end');
  });
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    { template: MODEL_TEMPLATE, imports: ['drawer'] },
    {
      inputs: { open: true, modal: true, header: 'Filters', position: 'start' },
    }
  );
  await expectScreenshot(page, testInfo);
});
