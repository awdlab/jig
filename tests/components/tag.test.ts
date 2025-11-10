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
    await handle.setInputs({ icon: 'icon.svg' });
    await expectScreenshot(page, testInfo, 'with-icon');
    await tag.expectIcon(true);
  });
});

test('kinds', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `
      <div class="page-center">
        @for (kind of inputs().kinds; track $index) {
          <ngn-tag [icon]="'icon.svg'" [kind]="kind">{{ kind ?? '*no kind*' }}</ngn-tag>
        }
      </div>
    `,
      imports: ['tag'],
    },
    {
      inputs: {
        kinds: [null, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
      },
    }
  );

  const firstTag = new NgnTagHarness(page.locator('ngn-tag').first());
  await firstTag.expectIcon(true);

  await expectScreenshot(page, testInfo, 'kinds');
});
