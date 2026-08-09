import test, { expect } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { evalValue, loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

const TEMPLATE = `
  <jig-command
    [items]="inputs().items"
    [open]="inputs().open"
    (openChange)="output('open', $event)"
    (commandSelected)="output('selected', $event.id)"
  />
`;

// `IconType` is an Iconify data object, not a name string. Same minimal stub
// `tests/components/icon.test.ts` uses.
const ICONIFY = { body: '<path d="M0 0h24v24H0z" />', width: 24, height: 24 };

const ITEMS = [
  {
    id: 'navigation',
    label: 'Navigation',
    children: [
      { id: 'home', label: 'Home', icon: ICONIFY },
      { id: 'inbox', label: 'Inbox', icon: ICONIFY },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    children: [
      // `alt` behaves the same on every platform, unlike `mod`
      { id: 'new-file', label: 'New File', shortcut: 'alt+n' },
      { id: 'copy', label: 'Copy', disabled: true },
    ],
  },
];

function loadCommand(page: import('@playwright/test').Page, open = true) {
  return loadComponent(
    page,
    { template: TEMPLATE, imports: ['command'] },
    { inputs: { items: ITEMS, open } }
  );
}

test('opens as a chromeless modal dialog holding a search field and a grouped list', async ({
  page,
}) => {
  await loadCommand(page);
  const dialog = page.locator('dialog');

  await expect(dialog).toBeVisible();
  await expect(dialog.locator('header')).toHaveCount(0);
  await expect(dialog.locator('button')).toHaveCount(0);
  await expect(dialog.locator('[role="option"]')).toHaveCount(4);
  await expect(dialog.locator('[role="group"]')).toHaveCount(2);
  await expect(dialog.getByRole('option', { name: 'Home' })).toBeVisible();
});

test('focuses the search field on open and filters as you type', async ({ page }) => {
  await loadCommand(page);
  const input = page.locator('dialog input');

  await expect(input).toBeFocused();

  await input.fill('inb');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(1);
  await expect(page.getByRole('option', { name: 'Inbox' })).toBeVisible();
  await expect(page.locator('dialog [role="group"]')).toHaveCount(1);

  await input.fill('zzz');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(0);
  await expect(page.getByText('No results found')).toBeVisible();
});

test('ArrowDown plus Enter activates the highlighted item, emits it and closes', async ({
  page,
}) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');

  await expect(input).toHaveAttribute('aria-activedescendant', /_option_home$/);

  await input.press('ArrowDown');
  await input.press('Enter');

  const log = await handle.getOutputLog();
  expect(log['selected']).toEqual(['inbox']);
  expect(log['open']?.at(-1)).toBe(false);
  await expect(page.locator('dialog')).toBeHidden();
});

test('the first command is highlighted on opening, so Enter runs it straight away', async ({
  page,
}) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');

  await expect(input).toHaveAttribute('aria-activedescendant', /_option_home$/);
  await input.press('Enter');

  const log = await handle.getOutputLog();
  expect(log['selected']).toEqual(['home']);
});

test('typing a space after highlighting an item types into the query, not activate it', async ({
  page,
}) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');

  await input.press('ArrowDown');
  await input.pressSequentially(' ho');

  await expect(input).toHaveValue(' ho');
  await expect(page.locator('dialog')).toBeVisible();
  const log = await handle.getOutputLog();
  expect(log['selected']).toBeUndefined();
});

test('Enter runs the first match after filtering, never the item highlighted before it', async ({
  page,
}) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');

  await expect(input).toHaveAttribute('aria-activedescendant', /_option_home$/);

  await input.fill('file');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(1);
  await expect(input).toHaveAttribute('aria-activedescendant', /_option_new-file$/);
  await input.press('Enter');

  const log = await handle.getOutputLog();
  expect(log['selected']).toEqual(['new-file']);
});

test('clicking an item runs its callback', async ({ page }) => {
  await loadComponent(
    page,
    { template: TEMPLATE, imports: ['command'] },
    {
      inputs: {
        open: true,
        items: evalValue(`[
          { id: 'ping', label: 'Ping', callback: () => ((window).__ngnPing = 'pong') },
        ]`),
      },
    }
  );

  await page.getByRole('option', { name: 'Ping' }).click();
  await expect.poll(() => page.evaluate(() => (window as any).__ngnPing)).toBe('pong');
});

test('the filter text resets between openings', async ({ page }) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');

  await input.fill('inb');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(1);

  await handle.setInputs({ items: ITEMS, open: false });
  await expect(page.locator('dialog')).toBeHidden();
  // see the reopen note above: AwdDialog's deferred close would overwrite an immediate reopen
  await page.waitForTimeout(50);

  await handle.setInputs({ items: ITEMS, open: true });
  await expect(page.locator('dialog')).toBeVisible();

  await expect(page.locator('dialog input')).toHaveValue('');
  await expect(page.locator('dialog [role="option"]')).toHaveCount(4);
});

test('renders a keycap for a command that configured a shortcut', async ({ page }) => {
  await loadCommand(page);

  const row = page.getByRole('option', { name: 'New File' });
  await expect(row.locator('kbd')).toHaveText('⌥N');
  // the keycap is decorative, so it must not leak into the option's accessible name
  await expect(row).toHaveAccessibleName('New File');
  await expect(page.getByRole('option', { name: 'Home' }).locator('kbd')).toHaveCount(0);

  // the keycap trails the label at the row's end rather than sitting next to it
  const rowBox = (await row.boundingBox())!;
  const keycapBox = (await row.locator('jig-kbd').boundingBox())!;
  const labelBox = (await row.locator('[class*="item-label"]').boundingBox())!;
  expect(rowBox.x + rowBox.width - (keycapBox.x + keycapBox.width)).toBeLessThan(20);
  expect(keycapBox.x - (labelBox.x + labelBox.width)).toBeGreaterThan(100);
});

test('pressing a command shortcut runs it and closes the palette', async ({ page }) => {
  const handle = await loadCommand(page);
  const input = page.locator('dialog input');
  await expect(input).toBeFocused();

  await input.press('Alt+n');

  const log = await handle.getOutputLog();
  expect(log['selected']).toEqual(['new-file']);
  await expect(page.locator('dialog')).toBeHidden();
});

test('a command shortcut fires while the palette is closed', async ({ page }) => {
  const handle = await loadCommand(page, false);
  await expect(page.locator('dialog')).toBeHidden();

  await page.keyboard.press('Alt+n');

  const log = await handle.getOutputLog();
  expect(log['selected']).toEqual(['new-file']);
  await expect(page.locator('dialog')).toBeHidden();
});

test('the footer legend lists the keys that drive the palette', async ({ page }) => {
  await loadCommand(page);
  const footer = page.locator('dialog footer');

  await expect(footer).toBeVisible();
  // the escape glyph is the kbd control's business, so only its presence is asserted here
  await expect(footer.locator('kbd')).toHaveText([/.+/, '↑', '↓', '↵']);
  await expect(footer).toContainText('Close');
  await expect(footer).toContainText('Select');
  await expect(footer).toContainText('Confirm');
});

test('the search field takes focus again on every opening', async ({ page }) => {
  const handle = await loadCommand(page);
  await expect(page.locator('dialog input')).toBeFocused();

  await handle.setInputs({ items: ITEMS, open: false });
  await expect(page.locator('dialog')).toBeHidden();
  // AwdDialog finishes closing in a requestAnimationFrame that sets `open` to false; reopening
  // before it lands is overwritten by it, so let the frame pass first.
  await page.waitForTimeout(50);

  await handle.setInputs({ items: ITEMS, open: true });
  await expect(page.locator('dialog')).toBeVisible();

  await expect(page.locator('dialog input')).toBeFocused();
});

// Touch-scrolling the backdrop cancels the pointer instead of releasing it. The
// resizable directive must not read that as an ongoing user resize and bake
// position/size onto the dialog when the filter changes its height.
test('a cancelled pointer does not bake the dialog position on the next filter change', async ({
  page,
}) => {
  await loadCommand(page);
  const dialog = page.locator('dialog');

  await dialog.dispatchEvent('pointerdown', { pointerType: 'touch' });
  await dialog.dispatchEvent('pointercancel', { pointerType: 'touch' });
  await dialog.locator('input').fill('new');
  await expect(dialog.locator('[role="option"]')).toHaveCount(1);

  expect(
    await dialog.evaluate(el => [el.style.top, el.style.left, el.style.height, el.style.maxHeight])
  ).toEqual(['', '', '', '60vh']);
});

test('visual', async ({ page }, testInfo) => {
  await loadCommand(page);
  const dialog = page.locator('dialog');
  await expect(dialog).toBeVisible();
  const input = dialog.locator('input');

  await test.step('opened', async () => {
    await expectScreenshot(page, testInfo, 'opened');
  });

  await test.step('filtered', async () => {
    await input.fill('new');
    await expect(dialog.locator('[role="option"]')).toHaveCount(1);
    await expectScreenshot(page, testInfo, 'filtered');
  });

  await test.step('no results', async () => {
    await input.fill('zzz');
    await expect(page.getByText('No results found')).toBeVisible();
    await expectScreenshot(page, testInfo, 'no-results');
  });
});

test('has no accessibility violations while open', async ({ page }) => {
  await loadCommand(page);
  await expect(page.locator('dialog')).toBeVisible();
  await expectNoA11yViolations(page);
});
