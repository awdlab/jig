import test, { expect } from '@playwright/test';

import { JigDialogHarness } from '@awdlab/jig-playwright';

import { expectOutput, loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const MODAL_TEMPLATE = `
  <jig-dialog
    [title]="inputs().title"
    [open]="inputs().open"
    [modal]="true"
    [closeBy]="inputs().closeBy"
    (openChange)="output('open', $event)"
    (closed)="output('closed', true)"
    [size]="{ width: '400px', maxWidth: '90vw' }"
  >
    Content
    <button id="dialog-btn">Focus me</button>
  </jig-dialog>
`;

function loadModal(page: import('@playwright/test').Page, closeBy = 'any', open = false) {
  return loadComponent(
    page,
    { template: MODAL_TEMPLATE, imports: ['dialog'] },
    {
      inputs: { title: 'My Dialog', open, closeBy },
    }
  );
}

test('opens/closes via the open model and labels itself from the title', async ({ page }) => {
  const handle = await loadModal(page, 'any', false);
  const dialog = new JigDialogHarness(page.locator('jig-dialog'));

  await dialog.expectOpened(false);

  await handle.setInputs({ title: 'My Dialog', open: true, closeBy: 'any' });
  await dialog.expectOpened();
  await dialog.expectModal();
  await expect(dialog.title).toHaveText('My Dialog');

  const labelId = await dialog.wrapper.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  await expect(page.locator(`#${labelId}`)).toHaveText('My Dialog');

  await handle.setInputs({ title: 'My Dialog', open: false, closeBy: 'any' });
  await dialog.expectOpened(false);
});

test('survives a reopen that happens before the deferred close lands', async ({ page }) => {
  const handle = await loadModal(page, 'any', true);
  const dialog = new JigDialogHarness(page.locator('jig-dialog'));
  await dialog.expectOpened();

  await handle.setInputs({ title: 'My Dialog', open: false, closeBy: 'any' });
  await handle.setInputs({ title: 'My Dialog', open: true, closeBy: 'any' });

  // Give the rAF-deferred close a chance to clobber the reopen.
  await page.evaluate(
    () =>
      new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );
  await dialog.expectOpened();
});

test('a modal dialog traps focus inside itself when opened', async ({ page }) => {
  const handle = await loadModal(page, 'any', false);
  await handle.setInputs({ title: 'My Dialog', open: true, closeBy: 'any' });

  const dialog = new JigDialogHarness(page.locator('jig-dialog'));
  await dialog.expectOpened();
  await expect
    .poll(() => dialog.wrapper.evaluate(el => el.contains(document.activeElement)))
    .toBe(true);
});

test('closeBy any closes on Escape, closeBy none ignores it', async ({ page, browserName }) => {
  // `closeBy` maps to the native `<dialog closedby>` attribute, which gates Escape
  // (and light-dismiss). The WebKit build Playwright bundles predates `closedby`
  // support (landed in Safari 18.2 / STP 242), so `closeBy: 'none'` cannot block
  // the native Escape close there. Browser-support gap, not a control bug.
  test.skip(browserName === 'webkit', '<dialog closedby> unsupported in this WebKit build');
  const handle = await loadModal(page, 'any', true);
  const dialog = new JigDialogHarness(page.locator('jig-dialog'));

  await dialog.pressEscape();
  await dialog.expectOpened(false);
  await expectOutput(handle, 'open', [false]);

  await loadModal(page, 'none', true);
  await dialog.pressEscape();
  await dialog.expectOpened();
});

test('closeBy any closes on a backdrop click', async ({ page }) => {
  const handle = await loadModal(page, 'any', true);
  const dialog = new JigDialogHarness(page.locator('jig-dialog'));
  await dialog.expectOpened();

  // The centered modal box does not cover the top-left corner; a click there
  // lands on the ::backdrop (event target is the <dialog>) → light dismiss.
  await page.mouse.click(3, 3);
  await dialog.expectOpened(false);
  await expectOutput(handle, 'open', [false]);
});

test('non-modal (popover) dialog opens and closes via the open model', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-dialog
          [title]="inputs().title"
          [open]="inputs().open"
          [modal]="false"
          (openChange)="output('open', $event)"
        >
          Content
        </jig-dialog>
      `,
      imports: ['dialog'],
    },
    { inputs: { title: 'Popover Dialog', open: false } }
  );

  // Popover mode leaves the native `open` flag unset, so visibility is the signal.
  const { wrapper } = new JigDialogHarness(page.locator('jig-dialog'));
  await expect(wrapper).toBeHidden();

  await handle.setInputs({ title: 'Popover Dialog', open: true });
  await expect(wrapper).toBeVisible();

  await handle.setInputs({ title: 'Popover Dialog', open: false });
  await expect(wrapper).toBeHidden();
});

test('footer buttons emit buttonClicked and the dialog emits closed', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-dialog
          [title]="inputs().title"
          [open]="inputs().open"
          [modal]="true"
          [footerButtons]="inputs().buttons"
          (buttonClicked)="output('button', $event)"
          (openChange)="output('open', $event)"
          (closed)="output('closed', true)"
        >
          Content
        </jig-dialog>
      `,
      imports: ['dialog'],
    },
    {
      inputs: {
        title: 'Buttons',
        open: true,
        buttons: [
          { label: 'Cancel', kind: 'secondary', value: 'cancel' },
          { label: 'Confirm', kind: 'primary', value: 'confirm' },
        ],
      },
    }
  );

  const dialog = new JigDialogHarness(page.locator('jig-dialog'));
  await dialog.expectOpened();
  await dialog.footerButtons.filter({ hasText: 'Confirm' }).click();

  await expectOutput(handle, 'button', ['confirm']);
});

test('lazy content stays unrendered until the dialog is opened for the first time', async ({
  page,
}) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ng-template #lazyTpl><p id="lazy-body">Lazy body</p></ng-template>
        <jig-dialog title="Lazy" [open]="inputs().open" [modal]="true" [content]="lazyTpl" [lazy]="true" />
      `,
      imports: ['dialog'],
    },
    { inputs: { open: false } }
  );

  await expect(page.locator('#lazy-body')).not.toBeAttached();

  await handle.setInputs({ open: true });
  await expect(page.locator('#lazy-body')).toBeVisible();
});

test('keeps lazy uncached content mounted until the close animation finishes', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ng-template #lazyTpl><p id="lazy-body">Lazy body</p></ng-template>
        <jig-dialog
          title="Lazy"
          [open]="inputs().open"
          [modal]="true"
          [content]="lazyTpl"
          [lazy]="true"
          [cache]="false"
        />
      `,
      imports: ['dialog'],
    },
    { inputs: { open: true } }
  );

  const dialog = new JigDialogHarness(page.locator('jig-dialog'));
  const body = page.locator('#lazy-body');
  await expect(body).toBeVisible();

  // A long-running animation on the dialog element stands in for the theme's exit transition.
  await dialog.wrapper.evaluate(el => {
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000 });
  });

  await handle.setInputs({ open: false });
  await page.waitForTimeout(300);
  await expect(body).toBeAttached();

  // Once it finishes, the uncached content is torn down again.
  await expect(body).not.toBeAttached({ timeout: 3000 });
});

test('accessibility (axe)', async ({ page }) => {
  await loadModal(page, 'any', true);
  await new JigDialogHarness(page.locator('jig-dialog')).expectOpened();
  await expectNoA11yViolations(page);
});

const CHROMELESS_TEMPLATE = `
  <jig-dialog
    [open]="inputs().open"
    [modal]="true"
    [closeButton]="inputs().closeButton"
    [label]="inputs().label"
  >
    <p id="chromeless-body">Body</p>
  </jig-dialog>
`;

test('drops header, footer and close button when nothing fills them', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: CHROMELESS_TEMPLATE, imports: ['dialog'] },
    { inputs: { open: true, closeButton: false, label: 'Palette' } }
  );

  const dialog = new JigDialogHarness(page.locator('jig-dialog'));
  await dialog.expectOpened();
  await expect(dialog.header).toHaveCount(0);
  await expect(dialog.footer).toHaveCount(0);
  await expect(dialog.wrapper.locator('button')).toHaveCount(0);
  await expect(dialog.wrapper).toHaveAttribute('aria-label', 'Palette');
  expect(await dialog.wrapper.getAttribute('aria-labelledby')).toBeNull();

  await handle.setInputs({ open: true, closeButton: true, label: 'Palette' });
  await expect(dialog.header).toHaveCount(1);
  await expect(dialog.closeButton).toHaveCount(1);
  await expect(dialog.footer).toHaveCount(0);
});

test('a titled dialog still renders its header, and keeps no dangling labelledby without one', async ({
  page,
}) => {
  const handle = await loadModal(page, 'any', true);
  const dialog = new JigDialogHarness(page.locator('jig-dialog'));

  const labelId = await dialog.wrapper.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  await expect(page.locator(`#${labelId}`)).toHaveText('My Dialog');

  await handle.setInputs({ title: null, open: true, closeBy: 'any' });
  expect(await dialog.wrapper.getAttribute('aria-labelledby')).toBeNull();
  await expect(dialog.header).toHaveCount(1);
});

test('visual', async ({ page }, testInfo) => {
  await loadModal(page, 'any', true);
  await new JigDialogHarness(page.locator('jig-dialog')).expectOpened();

  await expectScreenshot(page, testInfo, 'modal');
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadModal(page, 'any', true);
  await new JigDialogHarness(page.locator('jig-dialog')).expectOpened();
  await expectScreenshot(page, testInfo);
});
