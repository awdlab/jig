import test, { expect, type Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

// awd-defer gates its `lazyContent` template on `open() || (cache() && hasBeenOpened()) || !lazy()`.
// (Projected <ng-content> is always rendered; only the lazyContent template is deferred.)
// These tests cover that branch plus the aria-hidden reflection of `open`.
const content = (page: Page) =>
  page.locator('awd-defer').getByText('deferred content', { exact: true });

test('lazy (default): content is absent until opened, then torn down on close', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ng-template #tpl>deferred content</ng-template>
        <awd-defer [open]="inputs().open" [lazyContent]="tpl"></awd-defer>
      `,
      imports: ['defer'],
    },
    { inputs: { open: false } }
  );

  await expect(content(page)).toHaveCount(0);
  // ARIA: closed defer is hidden from assistive tech.
  await expect(page.locator('awd-defer')).toHaveAttribute('aria-hidden', 'true');

  await handle.setInputs({ open: true });
  await expect(content(page)).toBeVisible();
  await expect(page.locator('awd-defer')).toHaveAttribute('aria-hidden', 'false');

  // Not cached: content is removed again when closed.
  await handle.setInputs({ open: false });
  await expect(content(page)).toHaveCount(0);
});

test('cache: content stays rendered after being opened once', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ng-template #tpl>deferred content</ng-template>
        <awd-defer [open]="inputs().open" [lazyContent]="tpl" [cache]="true"></awd-defer>
      `,
      imports: ['defer'],
    },
    { inputs: { open: false } }
  );

  await expect(content(page)).toHaveCount(0);

  await handle.setInputs({ open: true });
  await expect(content(page)).toBeVisible();

  // Cached: content remains in the DOM after closing.
  await handle.setInputs({ open: false });
  await expect(content(page)).toHaveCount(1);
  await expect(page.locator('awd-defer')).toHaveAttribute('aria-hidden', 'true');
});

test('lazy=false: content renders immediately regardless of open', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <ng-template #tpl>deferred content</ng-template>
      <awd-defer [open]="false" [lazy]="false" [lazyContent]="tpl"></awd-defer>
    `,
    imports: ['defer'],
  });

  await expect(content(page)).toHaveCount(1);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <ng-template #tpl>deferred content</ng-template>
        <awd-defer [open]="inputs().open" [lazyContent]="tpl"></awd-defer>
      `,
      imports: ['defer'],
    },
    { inputs: { open: true } }
  );

  // Opened: content is rendered and aria-hidden reflects false.
  await expect(content(page)).toBeVisible();
  await expect(page.locator('awd-defer')).toHaveAttribute('aria-hidden', 'false');

  await expectNoA11yViolations(page);
});
