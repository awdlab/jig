import test, { expect } from '@playwright/test';
import { NgnStateHarness } from '@ngneers/controls-playwright';
import { loadComponent } from '../helper/load-component';

test('loading state fits inside a button', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <button ngnButton>
          Save
          <ngn-state kind="loading" />
        </button>
      `,
      imports: ['button', 'state'],
    },
    {}
  );

  const button = page.locator('button');
  const state = new NgnStateHarness(page.locator('ngn-state'));

  await expect(button).toHaveCSS('display', 'flex');
  await state.expectLoading();
  await expect(state.locator).toHaveCSS('display', 'flex');
  await expect(state.locator).toHaveCSS('width', '16px');
  await expect(state.locator).toHaveCSS('height', '16px');
});

test('replace content mode preserves button size and centers the state', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `
        <div style="display: flex; gap: 1rem; align-items: flex-start;">
          <button ngnButton data-testid="reference">
            Save
            <span>Label</span>
          </button>
          <button ngnButton data-testid="replace">
            Save
            <span data-testid="label">Label</span>
            <ngn-state kind="loading" replaceContent />
          </button>
        </div>
      `,
      imports: ['button', 'state'],
    },
    {}
  );

  const reference = page.getByTestId('reference');
  const button = page.getByTestId('replace');
  const label = page.getByTestId('label');
  const state = new NgnStateHarness(button.locator('ngn-state'));

  await state.expectLoading();
  await expect(button).toHaveCSS('position', 'relative');
  await expect(label).toHaveCSS('visibility', 'hidden');
  await expect(state.locator).toHaveCSS('position', 'absolute');

  const referenceBox = await reference.boundingBox();
  const buttonBox = await button.boundingBox();
  const stateBox = await state.locator.boundingBox();

  expect(referenceBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(stateBox).not.toBeNull();
  expect(Math.abs(buttonBox!.width - referenceBox!.width)).toBeLessThan(1);
  expect(Math.abs(buttonBox!.height - referenceBox!.height)).toBeLessThan(1);
  expect(
    Math.abs(stateBox!.x + stateBox!.width / 2 - (buttonBox!.x + buttonBox!.width / 2))
  ).toBeLessThan(1);
  expect(
    Math.abs(stateBox!.y + stateBox!.height / 2 - (buttonBox!.y + buttonBox!.height / 2))
  ).toBeLessThan(1);
});

test('semantic states render icons and visibility removes layout', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-state [kind]="inputs().kind" [visible]="inputs().visible" />`,
      imports: ['state'],
    },
    {
      inputs: {
        kind: 'success',
        visible: true,
      },
    }
  );

  const state = new NgnStateHarness(page.locator('ngn-state'));

  await state.expectIcon('success');

  for (const kind of ['warning', 'error', 'cancelled']) {
    await handle.setInputs({ kind, visible: true });
    await state.expectIcon(kind);
  }

  await handle.setInputs({ kind: 'loading', visible: true });
  await state.expectLoading();

  await handle.setInputs({ kind: 'success', visible: false });
  await expect(state.locator).toBeHidden();
  await expect(state.locator).toHaveCSS('display', 'none');
});

test('announces the applied kind to assistive tech via a live region', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-state [kind]="inputs().kind" [visible]="inputs().visible" [label]="inputs().label" />`,
      imports: ['state'],
    },
    {
      inputs: {
        kind: 'success',
        visible: true,
        label: undefined,
      },
    }
  );

  const host = page.locator('ngn-state');
  const srOnly = host.locator('span span').first();

  // Polite kinds → role="status", aria-live="polite".
  await expect(host).toHaveAttribute('role', 'status');
  await expect(host).toHaveAttribute('aria-live', 'polite');
  await expect(host).toHaveAttribute('aria-atomic', 'true');
  await expect(srOnly).toHaveText('Success');

  // Error/warning escalate to an assertive alert.
  await handle.setInputs({ kind: 'error', visible: true, label: undefined });
  await expect(host).toHaveAttribute('role', 'alert');
  await expect(host).toHaveAttribute('aria-live', 'assertive');
  await expect(srOnly).toHaveText('Error');

  await handle.setInputs({ kind: 'warning', visible: true, label: undefined });
  await expect(host).toHaveAttribute('role', 'alert');
  await expect(srOnly).toHaveText('Warning');

  // Loading is announced too, and the decorative spinner is hidden from AT.
  await handle.setInputs({ kind: 'loading', visible: true, label: undefined });
  await expect(host).toHaveAttribute('role', 'status');
  await expect(srOnly).toHaveText('Loading');
  await expect(page.locator('ngn-spinner')).toHaveAttribute('aria-hidden', 'true');

  // Explicit label overrides the derived one.
  await handle.setInputs({ kind: 'loading', visible: true, label: 'Saving…' });
  await expect(srOnly).toHaveText('Saving…');

  // Hidden indicator carries no live region.
  await handle.setInputs({ kind: 'success', visible: false, label: undefined });
  await expect(host).not.toHaveAttribute('role', /.+/);
  await expect(host).not.toHaveAttribute('aria-live', /.+/);
});

test('state keeps input field layout stable while toggling visibility', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `
        <ngn-input-field style="display: block; width: 240px;">
          <input ngnInput value="@ngneers/controls" />
          <ngn-state
            kind="success"
            [visible]="inputs().visible"
            ngnTooltip="Package is available."
          />
        </ngn-input-field>
      `,
      imports: ['inputField', 'input', 'state', 'tooltip'],
    },
    {
      inputs: {
        visible: false,
      },
    }
  );

  const field = page.locator('ngn-input-field');
  const fieldRoot = field.locator('div').first();
  const input = page.locator('input');
  const state = new NgnStateHarness(page.locator('ngn-state'));

  await expect(field).toBeVisible();
  await expect(state.locator).toHaveCSS('display', 'flex');
  await expect(state.locator).toHaveCSS('visibility', 'hidden');
  await expect(state.locator).toHaveCSS('box-sizing', 'border-box');
  await expect(state.locator).toHaveCSS('flex-shrink', '0');
  await expect(state.locator).toHaveCSS('pointer-events', 'auto');

  const hiddenMetrics = await fieldRoot.evaluate(el => ({
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
  }));
  const hiddenInputBox = await input.boundingBox();
  const hiddenStateBox = await state.locator.boundingBox();

  await handle.setInputs({ visible: true });

  await state.expectIcon('success');
  await expect(state.locator).toHaveCSS('visibility', 'visible');

  const visibleMetrics = await fieldRoot.evaluate(el => ({
    width: el.getBoundingClientRect().width,
    height: el.getBoundingClientRect().height,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
  }));
  const visibleInputBox = await input.boundingBox();
  const visibleStateBox = await state.locator.boundingBox();
  const iconBox = await state.icon.boundingBox();

  expect(hiddenInputBox).not.toBeNull();
  expect(hiddenStateBox).not.toBeNull();
  expect(visibleInputBox).not.toBeNull();
  expect(visibleStateBox).not.toBeNull();
  expect(iconBox).not.toBeNull();

  expect(Math.abs(visibleMetrics.width - hiddenMetrics.width)).toBeLessThan(1);
  expect(Math.abs(visibleMetrics.height - hiddenMetrics.height)).toBeLessThan(1);
  expect(Math.abs(visibleMetrics.scrollWidth - hiddenMetrics.scrollWidth)).toBeLessThan(1);
  expect(Math.abs(visibleMetrics.scrollHeight - hiddenMetrics.scrollHeight)).toBeLessThan(1);
  expect(Math.abs(visibleInputBox!.x - hiddenInputBox!.x)).toBeLessThan(1);
  expect(Math.abs(visibleInputBox!.width - hiddenInputBox!.width)).toBeLessThan(1);
  expect(Math.abs(visibleStateBox!.width - hiddenStateBox!.width)).toBeLessThan(1);
  expect(Math.abs(visibleStateBox!.height - hiddenStateBox!.height)).toBeLessThan(1);
  expect(Math.abs(iconBox!.width - 16)).toBeLessThan(1);
  expect(Math.abs(iconBox!.height - 16)).toBeLessThan(1);
  expect(Math.abs(visibleStateBox!.width - 24)).toBeLessThan(1);
  expect(Math.abs(visibleStateBox!.height - 24)).toBeLessThan(1);

  const hitPaddingPoint = {
    x: iconBox!.x - 2,
    y: iconBox!.y + iconBox!.height / 2,
  };
  const hitElementTag = await page.evaluate(({ x, y }) => {
    return document.elementFromPoint(x, y)?.closest('ngn-state')?.tagName ?? null;
  }, hitPaddingPoint);

  expect(hitElementTag).toBe('NGN-STATE');

  await page.mouse.click(hitPaddingPoint.x, hitPaddingPoint.y);
  await expect(input).toBeFocused();

  await page.keyboard.press('Control+A');
  await page.keyboard.type('!');
  await expect(input).toHaveValue('!');
});
