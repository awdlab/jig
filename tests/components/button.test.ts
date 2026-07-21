import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

test('applies the root theme class and emits clicks', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button ngnButton (click)="output('clicked', 'hit')">Click Me</button>`,
      imports: ['button'],
    },
    { inputs: {} }
  );

  const button = page.locator('button[ngnButton]');
  await expect(button).toHaveClass(/ngn-button-root/);

  await button.click();
  await button.click();

  const outputs = await handle.getOutputLog();
  expect(outputs['clicked']).toEqual(['hit', 'hit']);
});

test('toggles kind theme classes reactively', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button ngnButton [kind]="inputs().kind">Kinded</button>`,
      imports: ['button'],
    },
    { inputs: { kind: 'secondary' } }
  );

  const button = page.locator('button[ngnButton]');
  await expect(button).toHaveClass(/ngn-button-kind-secondary/);
  await expect(button).not.toHaveClass(/ngn-button-kind-icon/);

  // Switching the kind removes the previous kind class and adds the new one.
  await handle.setInputs({ kind: 'icon' });
  await expect(button).toHaveClass(/ngn-button-kind-icon/);
  await expect(button).not.toHaveClass(/ngn-button-kind-secondary/);
});

test('disabled button does not fire clicks', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button ngnButton kind="primary" [disabled]="inputs().disabled" (click)="output('clicked', true)">Disabled</button>`,
      imports: ['button'],
    },
    { inputs: { disabled: true } }
  );

  const button = page.locator('button[ngnButton]');
  await expect(button).toBeDisabled();

  // The disabled button carries a muted background distinct from its enabled state.
  const disabledBg = await button.evaluate(el => getComputedStyle(el).backgroundColor);

  // Force the click past pointer-events; the disabled button must still not fire.
  await button.click({ force: true });
  expect(await handle.getOutputLog()).toEqual({});

  // Re-enabling restores click behaviour.
  await handle.setInputs({ disabled: false });
  await expect(button).not.toBeDisabled();
  await expect
    .poll(async () => button.evaluate(el => getComputedStyle(el).backgroundColor))
    .not.toBe(disabledBg);
  await button.click();
  expect((await handle.getOutputLog())['clicked']).toEqual([true]);
});

test('directive works on anchor elements', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<a ngnButton href="#link">Link Button</a>`,
      imports: ['button'],
    },
    { inputs: {} }
  );

  const anchor = page.locator('a[ngnButton]');
  await expect(anchor).toHaveClass(/ngn-button-root/);
  await expect(anchor).toHaveAttribute('href', '#link');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<button ngnButton [kind]="inputs().kind">Save changes</button>`,
      imports: ['button'],
    },
    { inputs: { kind: 'primary' } }
  );
  await expectNoA11yViolations(page);
});
