import { JigKbdHarness } from '@awdlab/jig-playwright';
import test, { expect } from '@playwright/test';

import { expectNoA11yViolations } from '../helper/axe';
import { expectOutput, loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('renders shortcut glyphs', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-kbd [shortcut]="inputs().shortcut" />`,
      imports: ['kbd'],
    },
    // Literal modifiers, so the expectation holds on every platform — `mod` renders
    // ⌘ on macOS and ⌃ everywhere else.
    { inputs: { shortcut: 'ctrl+shift+a' } }
  );

  const kbd = new JigKbdHarness(page.locator('jig-kbd'));
  await kbd.expectText('⌃⇧A');
});

test('visual', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
        <div class="page-center flex items-center gap-4">
          @for (shortcut of inputs().shortcuts; track $index) {
            <jig-kbd [shortcut]="shortcut" />
          }
        </div>
      `,
      imports: ['kbd'],
    },
    // Literal modifiers only — `mod` renders a platform-dependent glyph.
    { inputs: { shortcuts: ['ctrl+shift+a', 'alt+enter', 'escape', 'arrowup', 'k'] } }
  );

  await expectScreenshot(page, testInfo, 'glyphs');
});

test('nested scope binds an action button shortcut to the nearest ancestor', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <div [ngnKeyboardShortcut]="inputs().outer">
          <input id="outer-field" />
          <div [ngnKeyboardShortcut]="inputs().inner">
            <jig-action-button [config]="inputs().buttons[0]" (clicked)="output('button', $event)" />
            <input id="inner-field" />
          </div>
        </div>
      `,
      imports: ['keyboardShortcut', 'actionButton'],
    },
    {
      inputs: {
        outer: [],
        inner: [],
        buttons: [{ label: 'Save', value: 'save', shortcut: 'mod+s' }],
      },
    }
  );

  // The action button is registered with the inner scope, so a press from the
  // outer scope's own field must not reach it.
  await page.locator('#outer-field').focus();
  await page.keyboard.press('Control+s');
  expect((await handle.getOutputLog())['button']).toBeUndefined();

  await page.locator('#inner-field').focus();
  await page.keyboard.press('Control+s');
  await expectOutput(handle, 'button', ['save']);
});

test('dialog footer button fires on its shortcut', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <jig-dialog
          title="Confirm"
          [open]="true"
          [modal]="true"
          [footerButtons]="inputs().buttons"
          (buttonClicked)="output('button', $event)"
        >
          <input id="field" />
        </jig-dialog>
      `,
      imports: ['dialog'],
    },
    { inputs: { buttons: [{ label: 'Save', value: 'save', shortcut: 'mod+s' }] } }
  );

  await expect(page.locator('dialog')).toBeVisible();
  await page.locator('#field').focus();
  await page.keyboard.press('Control+s');

  await expectOutput(handle, 'button', ['save']);
});

// Mirrors the docs demo: the dialog starts closed and opens later, which is where a
// once-only autofocus latches on a hidden element and never retries.
const RENAME_DIALOG = `
  <jig-dialog
    title="Rename"
    [open]="inputs().open"
    [modal]="true"
    [footerButtons]="inputs().buttons"
    (buttonClicked)="output('button', $event)"
  >
    <jig-input-field label="New name" inputId="field">
      <input ngnInput autofocus />
    </jig-input-field>
  </jig-dialog>
`;

const RENAME_BUTTONS = [
  { label: 'Cancel', value: 'cancel', kind: 'secondary', shortcut: 'escape' },
  { label: 'Confirm', value: 'confirm', kind: 'primary', shortcut: 'ctrl+enter' },
];

test('a dialog opened after render autofocuses its projected field', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: RENAME_DIALOG, imports: ['dialog', 'input', 'inputField'] },
    { inputs: { open: false, buttons: RENAME_BUTTONS } }
  );

  await handle.setInputs({ open: true });
  await expect(page.locator('dialog')).toBeVisible();
  await expect(page.locator('#field')).toBeFocused();
});

test('escape and ctrl+enter reach footer buttons from the autofocused field', async ({ page }) => {
  const handle = await loadComponent(
    page,
    { template: RENAME_DIALOG, imports: ['dialog', 'input', 'inputField'] },
    { inputs: { open: false, buttons: RENAME_BUTTONS } }
  );

  await handle.setInputs({ open: true });
  await expect(page.locator('#field')).toBeFocused();

  // No focus() call anywhere — escape reaches the scope because the editable-target
  // guard lets keys through that type nothing.
  await page.keyboard.press('Escape');
  await expectOutput(handle, 'button', ['cancel']);

  await handle.setInputs({ open: true });
  await expect(page.locator('#field')).toBeFocused();
  await page.keyboard.press('Control+Enter');
  await expectOutput(handle, 'button', ['cancel', 'confirm']);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-kbd [shortcut]="inputs().shortcut" />`,
      imports: ['kbd'],
    },
    { inputs: { shortcut: 'ctrl+shift+a' } }
  );

  const kbd = new JigKbdHarness(page.locator('jig-kbd'));
  await kbd.expectText('⌃⇧A');
  await expectNoA11yViolations(page);
});
