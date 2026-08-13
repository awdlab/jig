import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { useRtl } from '../helper/direction';
import { JigMessageHarness } from '@awdlab/jig-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('features', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `
      <jig-message
        class="page-center"
        [icon]="inputs().icon"
      >Message text content</jig-message>
    `,
      imports: ['message'],
    },
    {
      inputs: { icon: undefined },
    }
  );

  const message = new JigMessageHarness(page.locator('jig-message'));

  await test.step('default', async () => {
    await expectScreenshot(page, testInfo, 'default');
    await message.expectIcon(false);
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
                <jig-message [kind]="kind" [color]="color">{{ color ?? 'default' }} message</jig-message>
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

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-message
        [icon]="inputs().icon"
      >Message text content</jig-message>`,
      imports: ['message'],
    },
    {
      inputs: {
        icon: {
          body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>',
          width: 24,
          height: 24,
        },
      },
    }
  );

  await expectNoA11yViolations(page);
});

test('rtl', async ({ page }, testInfo) => {
  await useRtl(page);
  await loadComponent(
    page,
    {
      template: `
      <jig-message
        class="page-center"
        [icon]="inputs().icon"
      >Message text content</jig-message>
    `,
      imports: ['message'],
    },
    {
      inputs: { icon: undefined },
    }
  );
  await expectScreenshot(page, testInfo);
});
