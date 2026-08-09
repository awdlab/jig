import { expect, test } from '@playwright/test';

import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

test('input validation errors drive a normal hint', async ({ page }) => {
  await loadComponent(page, {
    template: `
        <div class="page-center" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <input
            jigInput
            name="email"
            ngModel
            required
            email
            jigErrors
            [jigErrorsHint]="emailHint"
          />
          <jig-hint #emailHint />
        </div>
      `,
    imports: ['input', 'hint', 'errors', 'forms'],
  });

  const input = page.locator('input[jigInput]');
  const hint = page.locator('jig-hint');

  await expect(hint).toHaveText('');

  await input.focus();
  await input.blur();
  await expect(hint).toContainText('Required');

  await input.fill('not-an-email');
  await expect(hint).toContainText('Enter a valid email address');
});

test('custom checkbox errors drive a normal hint', async ({ page }) => {
  await loadComponent(page, {
    template: `
        <div class="page-center" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <jig-checkbox
            jigErrors
            jigErrorsShowOn="always"
            [jigErrorsHint]="termsHint"
            [jigErrorsCustom]="{ terms: 'Accept the terms' }"
          />
          <jig-hint #termsHint />
        </div>
      `,
    imports: ['checkbox', 'hint', 'errors'],
  });

  await expect(page.locator('jig-hint')).toContainText('Accept the terms');
});

test('async validation shows pending and resolved messages', async ({ page }) => {
  await loadComponent(page, {
    template: `
        <div class="page-center" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <input
            jigInput
            name="server"
            ngModel
            jigTestAsyncValidator
            jigErrors
            jigErrorsShowOn="always"
            [jigErrorsHint]="serverHint"
            [jigErrorsMessages]="{ server: 'Server rejected the value' }"
          />
          <jig-hint #serverHint />
        </div>
      `,
    imports: ['input', 'hint', 'errors', 'forms', 'testAsyncValidator'],
  });

  const hint = page.locator('jig-hint');

  await expect(hint).toContainText('Validating...');
  await expect(hint).toContainText('Server rejected the value');
});

test('accessibility (axe)', async ({ page }) => {
  // The input is named by the input-field label so axe can attribute the errors.
  await loadComponent(page, {
    template: `
      <div class="page-center" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <jig-input-field label="Email">
          <input jigInput name="email" ngModel required email jigErrors [jigErrorsHint]="emailHint" />
        </jig-input-field>
        <jig-hint #emailHint />
      </div>
    `,
    imports: ['input', 'hint', 'errors', 'forms', 'inputField'],
  });

  const input = page.locator('input[jigInput]');
  await input.focus();
  await input.blur();
  await expect(page.locator('jig-hint')).toContainText('Required');

  await expectNoA11yViolations(page);
});
