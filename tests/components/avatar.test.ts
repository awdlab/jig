import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { NgnAvatarHarness } from '@ngneers/controls-playwright';
import { expectScreenshot } from '../helper/screenshot';

test('initials & image', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<ngn-avatar [initials]="inputs().initials" [image]="inputs().image" />`,
      imports: ['avatar'],
    },
    {
      inputs: {
        initials: 'AB',
      },
    }
  );

  const avatar = new NgnAvatarHarness(page.locator('ngn-avatar'));
  await avatar.expectInitials('AB');
  handle.setInputs({ initials: 'CD' });
  await avatar.expectInitials('CD');
  handle.setInputs({ image: 'does-not-exist.png', initials: 'EF' });
  await avatar.expectInitials('EF');
  handle.setInputs({ image: 'example.png' });
  await page.waitForTimeout(200); // Wait for image to load
  await avatar.expectImageSrc('example.png');
});

test('sizes', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `@for(size of inputs().sizes; track size) {
        @for(initial of inputs().initials; track initial) {
          <ngn-avatar [initials]="initial ? initial : undefined" [image]="initial ? undefined : 'example.png'" [size]="size" />
        }
          <br />
      }`,
      imports: ['avatar'],
    },
    {
      inputs: {
        sizes: [10, 16, 20, 24, 32, 48, 64, 96, 128],
        initials: ['A', 'AB', 'ABC', 'ABCD', false],
      },
    }
  );

  await expect(page.locator('ngn-avatar')).toHaveCount(45);
  await expectScreenshot(page, testInfo);
});
