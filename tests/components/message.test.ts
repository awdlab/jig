import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnMessageHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-message
        class="page-center"
        [icon]="inputs().icon"
      >Message text content</ngn-message>
    `,
      imports: ['message'],
    },
    {
      inputs: { icon: undefined },
    }
  );

  const message = new NgnMessageHarness(page.locator('ngn-message'));

  await test.step('default', async () => {
    await expectScreenshot(page, testInfo, 'default');
    await message.expectIcon(false);
  });

  await test.step('with icon', async () => {
    await handle.setInputs({ icon: 'icon.svg' });
    await expectScreenshot(page, testInfo, 'with-icon');
    await message.expectIcon(true);
  });
});

test('kinds and colors', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <div class="page-center">
        <div style="display: flex; gap: 0.5rem; flex-direction: column;">
          @for (kind of inputs().kinds; track $index) {
            @if (inputs().kinds.length > 1) {
              <div>Kind: {{ kind ?? 'default' }}</div>
            }
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              @for (color of inputs().colors; track $index) {
                <ngn-message [kind]="kind" [color]="color">{{ color ?? 'default' }} message</ngn-message>
              }
            </div>
          }
        </div>
      </div>
    `,
      imports: ['message'],
    },
    {
      inputs: {
        kinds: ['default', 'outlined', 'simple'],
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

  await expectScreenshot(page, testInfo, 'kinds-and-colors');
});
