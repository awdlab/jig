import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { AwdAvatarHarness } from '@awdlab/jig-playwright';
import { expectScreenshot } from '../helper/screenshot';
import { expectNoA11yViolations } from '../helper/axe';

test('initials & image', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<jig-avatar [initials]="inputs().initials" [image]="inputs().image" />`,
      imports: ['avatar'],
    },
    {
      inputs: {
        initials: 'AB',
      },
    }
  );

  const avatar = new AwdAvatarHarness(page.locator('jig-avatar'));
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
          <jig-avatar [initials]="initial ? initial : undefined" [image]="initial ? undefined : 'example.png'" [size]="size" />
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

  await expect(page.locator('jig-avatar')).toHaveCount(45);
  await expectScreenshot(page, testInfo);
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<jig-avatar [initials]="inputs().initials" />`,
      imports: ['avatar'],
    },
    { inputs: { initials: 'AB' } }
  );
  await expectNoA11yViolations(page);
});
