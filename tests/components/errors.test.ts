import { expect, test } from '@playwright/test';

import { loadComponent } from '../helper/load-component';

test('input validation errors drive a normal hint', async ({ page }) => {
  await loadComponent(page, {
    template: `
        <div class="page-center" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <input
            ngnInput
            name="email"
            ngModel
            required
            email
            ngnErrors
            [ngnErrorsHint]="emailHint"
          />
          <ngn-hint #emailHint />
        </div>
      `,
    imports: ['input', 'hint', 'errors', 'forms'],
  });

  const input = page.locator('input[ngnInput]');
  const hint = page.locator('ngn-hint');

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
          <ngn-checkbox
            ngnErrors
            ngnErrorsShowOn="always"
            [ngnErrorsHint]="termsHint"
            [ngnErrorsCustom]="{ terms: 'Accept the terms' }"
          />
          <ngn-hint #termsHint />
        </div>
      `,
    imports: ['checkbox', 'hint', 'errors'],
  });

  await expect(page.locator('ngn-hint')).toContainText('Accept the terms');
});

test('async validation shows pending and resolved messages', async ({ page }) => {
  await loadComponent(page, {
    template: `
        <div class="page-center" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <input
            ngnInput
            name="server"
            ngModel
            ngnTestAsyncValidator
            ngnErrors
            ngnErrorsShowOn="always"
            [ngnErrorsHint]="serverHint"
            [ngnErrorsMessages]="{ server: 'Server rejected the value' }"
          />
          <ngn-hint #serverHint />
        </div>
      `,
    imports: ['input', 'hint', 'errors', 'forms', 'testAsyncValidator'],
  });

  const hint = page.locator('ngn-hint');

  await expect(hint).toContainText('Validating...');
  await expect(hint).toContainText('Server rejected the value');
});
