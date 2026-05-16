import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnTagHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-tag
        class="page-center"
        [icon]="inputs().icon"
      >Tag</ngn-tag>
    `,
      imports: ['tag'],
    },
    {
      inputs: { icon: undefined },
    }
  );

  const tag = new NgnTagHarness(page.locator('ngn-tag'));

  await test.step('default', async () => {
    await expectScreenshot(page, testInfo, 'default');
    await tag.expectIcon(false);
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
    await tag.expectIcon(true);
  });
});

test('kinds and colors', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <div class="page-center">
        <div class="flex gap-2 flex-wrap">
          @for (kind of inputs().kinds; track $index) {
            @if (inputs().kinds.length > 1) {
              <div class="w-full font-bold mt-4 mb-2">Kind: {{ kind ?? '*none*' }}</div>
            }
            @for (color of inputs().colors; track $index) {
              <ngn-tag [kind]="kind" [color]="color">{{ color ?? 'default' }}</ngn-tag>
            }
          }
        </div>
      </div>
    `,
      imports: ['tag'],
    },
    {
      inputs: {
        kinds: ['default', 'pill'],
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
