import { expect, test } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnHintHarness } from '@awdlab/jig-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <awd-hint
        class="page-center"
        [icon]="inputs().icon"
      >Hint text content</awd-hint>
    `,
      imports: ['hint'],
    },
    {
      inputs: { icon: undefined },
    }
  );

  const hint = new NgnHintHarness(page.locator('awd-hint'));

  await test.step('default', async () => {
    await expectScreenshot(page, testInfo, 'default');
    await hint.expectIcon(false);
  });

  await test.step('with icon', async () => {
    await handle.setInputs({
      icon: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
        width: 24,
        height: 24,
      },
    });
    await expectScreenshot(page, testInfo, 'with-icon');
    await hint.expectIcon(true);
  });
});

test('kinds', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <div class="page-center">
        <div style="display: flex; gap: 0.5rem; flex-direction: column;">
          @for (kind of inputs().kinds; track $index) {
            <awd-hint [kind]="kind">{{ kind ?? 'default' }} hint</awd-hint>
          }
        </div>
      </div>
    `,
      imports: ['hint'],
    },
    {
      inputs: {
        kinds: ['default', 'info', 'success', 'warning', 'error'],
      },
    }
  );

  await expectScreenshot(page, testInfo, 'kinds');
  await expect(page.locator('awd-hint awd-icon')).toHaveCount(4); // default has no icon
});
test('iconOnly validation shows the error in a tooltip', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <div class="page-center" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <input
          ngnInput
          name="email"
          ngModel
          required
          ngnErrors
          [ngnErrorsHint]="emailHint"
        />
        <awd-hint #emailHint kind="error" iconOnly="true" />
      </div>
    `,
    imports: ['input', 'hint', 'errors', 'forms'],
  });

  const input = page.locator('input[ngnInput]');
  const hint = page.locator('awd-hint');
  const icon = hint.locator('awd-icon');

  await expect(hint).toHaveCount(1);
  await expect(hint).toHaveText('');
  await expect(icon).toHaveCount(0);

  await input.focus();
  await input.blur();

  await expect(hint).toHaveText('');
  await expect(icon).toHaveCount(1);
  await expect(icon).toBeVisible();

  await icon.hover();
  await expect(page.getByRole('tooltip')).toContainText('Required');
});

test('iconOnly keeps the kind icon when hidden validation has normal content', async ({ page }) => {
  await loadComponent(page, {
    template: `
      <awd-hint
        class="page-center"
        kind="error"
        iconOnly="true"
        [content]="'Static help text'"
        [validationState]="{ visible: false, pending: false, message: null }"
      />
    `,
    imports: ['hint'],
  });

  const hint = page.locator('awd-hint');
  const icon = hint.locator('awd-icon');

  await expect(hint).toHaveText('');
  await expect(icon).toHaveCount(1);
  await expect(icon).toBeVisible();

  await icon.hover();
  await expect(page.getByRole('tooltip')).toContainText('Static help text');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<awd-hint class="page-center" [kind]="'info'">Hint text content</awd-hint>`,
      imports: ['hint'],
    },
    { inputs: {} }
  );
  await expectNoA11yViolations(page);
});
