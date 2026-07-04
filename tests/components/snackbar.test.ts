import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnSnackbarHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-snackbar
        class="page-center"
        [header]="inputs().header"
        [content]="inputs().content"
        [icon]="inputs().icon"
        [closable]="inputs().closable"
        [autoHide]="false"
        (closeSnackbar)="output('closeSnackbar', $event)"
      />
    `,
      imports: ['snackbar'],
    },
    {
      inputs: {
        header: 'Notification',
        content: 'This is a basic snackbar message.',
        icon: undefined,
        closable: false,
      },
    }
  );

  const snackbar = new NgnSnackbarHarness(page.locator('ngn-snackbar'));

  await test.step('default', async () => {
    await snackbar.expectHeader('Notification');
    await snackbar.expectContent('This is a basic snackbar message.');
    await snackbar.expectIcon(false);
    await snackbar.expectClosable(false);
    await expectScreenshot(page, testInfo, 'default');
  });

  await test.step('with icon', async () => {
    await handle.setInputs({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
      icon: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
        width: 24,
        height: 24,
      },
      closable: false,
    });
    await snackbar.expectIcon(true);
    await expectScreenshot(page, testInfo, 'with-icon');
  });

  await test.step('closable', async () => {
    await handle.setInputs({
      header: 'Notification',
      content: 'This is a basic snackbar message.',
      icon: undefined,
      closable: true,
    });
    await snackbar.expectClosable(true);
    await expectScreenshot(page, testInfo, 'closable');

    await snackbar.close();
    // closeSnackbar is an `output<void>`, so each emission logs `undefined` — assert it fired once.
    expect((await handle.getOutputLog())['closeSnackbar']).toHaveLength(1);
  });
});

test('colors', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <div class="page-center">
        <div class="flex gap-2 flex-col">
          @for (color of inputs().colors; track $index) {
            <ngn-snackbar
              [color]="color"
              [header]="color ?? 'default'"
              [content]="'Snackbar message'"
              [autoHide]="false"
            />
          }
        </div>
      </div>
    `,
      imports: ['snackbar'],
    },
    {
      inputs: {
        colors: [
          'surface',
          'primary',
          'secondary',
          'accent',
          'success',
          'warning',
          'error',
          'info',
        ],
      },
    }
  );

  await expectScreenshot(page, testInfo, 'colors');
});
