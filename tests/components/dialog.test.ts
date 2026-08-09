import test, { expect } from '@playwright/test';

import { expectOutput, loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

const MODAL_TEMPLATE = `
  <awd-dialog
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
  </awd-dialog>
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
  const dialog = page.locator('dialog');

  await expect(dialog).toBeHidden();

  await handle.setInputs({ title: 'My Dialog', open: true, closeBy: 'any' });
  await expect(dialog).toBeVisible();

  const labelId = await dialog.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  await expect(page.locator(`#${labelId}`)).toHaveText('My Dialog');

  await handle.setInputs({ title: 'My Dialog', open: false, closeBy: 'any' });
  await expect(dialog).toBeHidden();
});

test('survives a reopen that happens before the deferred close lands', async ({ page }) => {
  const handle = await loadModal(page, 'any', true);
  const dialog = page.locator('dialog');
  await expect(dialog).toBeVisible();

  await handle.setInputs({ title: 'My Dialog', open: false, closeBy: 'any' });
  await handle.setInputs({ title: 'My Dialog', open: true, closeBy: 'any' });

  // Give the rAF-deferred close a chance to clobber the reopen.
  await page.evaluate(
    () =>
      new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );
  await expect(dialog).toBeVisible();
});

test('a modal dialog traps focus inside itself when opened', async ({ page }) => {
  const handle = await loadModal(page, 'any', false);
  await handle.setInputs({ title: 'My Dialog', open: true, closeBy: 'any' });

  await expect(page.locator('dialog')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const d = document.querySelector('dialog');
        return !!d && d.contains(document.activeElement);
      })
    )
    .toBe(true);
});

test('closeBy any closes on Escape, closeBy none ignores it', async ({ page, browserName }) => {
  // `closeBy` maps to the native `<dialog closedby>` attribute, which gates Escape
  // (and light-dismiss). The WebKit build Playwright bundles predates `closedby`
  // support (landed in Safari 18.2 / STP 242), so `closeBy: 'none'` cannot block
  // the native Escape close there. Browser-support gap, not a control bug.
  test.skip(browserName === 'webkit', '<dialog closedby> unsupported in this WebKit build');
  const handle = await loadModal(page, 'any', true);
  const dialog = page.locator('dialog');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expectOutput(handle, 'open', [false]);

  const handleNone = await loadModal(page, 'none', true);
  const dialogNone = page.locator('dialog');
  await expect(dialogNone).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialogNone).toBeVisible();
});

test('closeBy any closes on a backdrop click', async ({ page }) => {
  const handle = await loadModal(page, 'any', true);
  const dialog = page.locator('dialog');
  await expect(dialog).toBeVisible();

  // The centered modal box does not cover the top-left corner; a click there
  // lands on the ::backdrop (event target is the <dialog>) → light dismiss.
  await page.mouse.click(3, 3);
  await expect(dialog).toBeHidden();
  await expectOutput(handle, 'open', [false]);
});

test.describe('touch', () => {
  test.use({ hasTouch: true, isMobile: true });

  test('a backdrop tap closes the modal and never reaches the page behind', async ({ page }) => {
    const handle = await loadComponent(
      page,
      {
        template: `
          <button style="position:fixed;bottom:20px;left:20px;width:200px;height:60px"
                  (click)="output('behind', true)">Behind</button>
          ${MODAL_TEMPLATE}
        `,
        imports: ['dialog'],
      },
      { inputs: { title: 'My Dialog', open: true, closeBy: 'any' } }
    );
    const dialog = page.locator('dialog');
    await expect(dialog).toBeVisible();

    const box = (await page.locator('button', { hasText: 'Behind' }).boundingBox())!;
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);

    await expect(dialog).toBeHidden();
    await expectOutput(handle, 'open', [false]);
    expect((await handle.getOutputLog())['behind']).toBeUndefined();
  });
});

test('non-modal (popover) dialog opens and closes via the open model', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <awd-dialog
          [title]="inputs().title"
          [open]="inputs().open"
          [modal]="false"
          (openChange)="output('open', $event)"
        >
          Content
        </awd-dialog>
      `,
      imports: ['dialog'],
    },
    { inputs: { title: 'Popover Dialog', open: false } }
  );

  const dialog = page.locator('dialog');
  await expect(dialog).toBeHidden();

  await handle.setInputs({ title: 'Popover Dialog', open: true });
  await expect(dialog).toBeVisible();

  await handle.setInputs({ title: 'Popover Dialog', open: false });
  await expect(dialog).toBeHidden();
});

test('footer buttons emit buttonClicked and the dialog emits closed', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <awd-dialog
          [title]="inputs().title"
          [open]="inputs().open"
          [modal]="true"
          [footerButtons]="inputs().buttons"
          (buttonClicked)="output('button', $event)"
          (openChange)="output('open', $event)"
          (closed)="output('closed', true)"
        >
          Content
        </awd-dialog>
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

  await expect(page.locator('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();

  await expectOutput(handle, 'button', ['confirm']);
});

test('accessibility (axe)', async ({ page }) => {
  await loadModal(page, 'any', true);
  await expect(page.locator('dialog')).toBeVisible();
  await expectNoA11yViolations(page);
});

const CHROMELESS_TEMPLATE = `
  <awd-dialog
    [open]="inputs().open"
    [modal]="true"
    [closeButton]="inputs().closeButton"
    [label]="inputs().label"
  >
    <p id="chromeless-body">Body</p>
  </awd-dialog>
`;

test('drops header, footer and close button when nothing fills them', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: CHROMELESS_TEMPLATE, imports: ['dialog'] },
    { inputs: { open: true, closeButton: false, label: 'Palette' } }
  );

  const dialog = page.locator('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('header')).toHaveCount(0);
  await expect(dialog.locator('footer')).toHaveCount(0);
  await expect(dialog.locator('button')).toHaveCount(0);
  await expect(dialog).toHaveAttribute('aria-label', 'Palette');
  expect(await dialog.getAttribute('aria-labelledby')).toBeNull();

  await handle.setInputs({ open: true, closeButton: true, label: 'Palette' });
  await expect(dialog.locator('header')).toHaveCount(1);
  await expect(dialog.locator('header button')).toHaveCount(1);
  await expect(dialog.locator('footer')).toHaveCount(0);
});

test('a titled dialog still renders its header, and keeps no dangling labelledby without one', async ({
  page,
}) => {
  const handle = await loadModal(page, 'any', true);
  const dialog = page.locator('dialog');

  const labelId = await dialog.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  await expect(page.locator(`#${labelId}`)).toHaveText('My Dialog');

  await handle.setInputs({ title: null, open: true, closeBy: 'any' });
  expect(await dialog.getAttribute('aria-labelledby')).toBeNull();
  await expect(dialog.locator('header')).toHaveCount(1);
});

test('visual', async ({ page }, testInfo) => {
  await loadModal(page, 'any', true);
  await expect(page.locator('dialog')).toBeVisible();

  await expectScreenshot(page, testInfo, 'modal');
});
