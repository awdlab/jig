import test from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnHintHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-hint
        class="page-center"
        [icon]="inputs().icon"
      >Hint text content</ngn-hint>
    `,
      imports: ['hint'],
    },
    {
      inputs: { icon: undefined },
    }
  );

  const hint = new NgnHintHarness(page.locator('ngn-hint'));

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
            <ngn-hint [kind]="kind">{{ kind ?? 'default' }} hint</ngn-hint>
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
});
