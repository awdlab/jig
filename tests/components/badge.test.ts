import test, { expect } from '@playwright/test';
import { NgnBadgeHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';
import { loadComponent } from '../helper/load-component';
import { expectScreenshot } from '../helper/screenshot';

test('renders count and clamps to max', async ({ page }, testInfo) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button style="width:48px;height:48px" [ngnBadge]="inputs().value" [ngnBadgeMax]="inputs().max">A</button>`,
      imports: ['badge'],
    },
    { inputs: { value: 3, max: 99 } }
  );

  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectText('3');
  await expectScreenshot(page, testInfo, 'count-3');

  await handle.setInputs({ value: 150 });
  await badge.expectText('99+');
});

test('hides on zero unless showZero', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button [ngnBadge]="inputs().value" [ngnBadgeShowZero]="inputs().showZero">A</button>`,
      imports: ['badge'],
    },
    { inputs: { value: 0, showZero: false } }
  );

  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectVisible(false);

  await handle.setInputs({ showZero: true });
  await badge.expectVisible(true);
  await badge.expectText('0');
});

test('dot mode ignores value', async ({ page }, testInfo) => {
  await loadComponent(
    page,
    {
      template: `<button style="width:48px;height:48px" [ngnBadge]="5" ngnBadgeDot>A</button>`,
      imports: ['badge'],
    },
    { inputs: {} }
  );
  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectVisible(true);
  await badge.expectText('');
});

test('dot mode works standalone (ngnBadgeDot without ngnBadge)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<button style="width:48px;height:48px" ngnBadgeDot>A</button>`,
      imports: ['badge'],
    },
    { inputs: {} }
  );
  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectVisible(true);
  await badge.expectText('');
});

test('hiding a visible badge destroys the indicator', async ({ page }) => {
  const handle = await loadComponent(
    page,
    {
      template: `<button [ngnBadge]="5" [ngnBadgeHidden]="inputs().hidden">A</button>`,
      imports: ['badge'],
    },
    { inputs: { hidden: false } }
  );

  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectVisible(true);

  await handle.setInputs({ hidden: true });
  await badge.expectVisible(false);
});

test('custom color applies as css variable', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<button [ngnBadge]="1" ngnBadgeColor="rgb(10, 20, 30)">A</button>`,
      imports: ['badge'],
    },
    { inputs: {} }
  );
  const badge = new NgnBadgeHarness(page.locator('button'));
  await expect(badge.badge).toHaveCSS('background-color', 'rgb(10, 20, 30)');
});

test('anchors correctly on a wrapper around a clipping host (avatar)', async ({
  page,
}, testInfo) => {
  // awd-avatar has overflow:hidden, so a badge placed directly on it would be
  // clipped. The documented pattern is to anchor the badge on a thin wrapper.
  await loadComponent(
    page,
    {
      template: `<div style="padding: 20px; width: max-content;"><span class="inline-flex" [ngnBadge]="5" ngnBadgePosition="top-end"><awd-avatar initials="JD" /></span></div>`,
      imports: ['badge', 'avatar'],
    },
    { inputs: {} }
  );

  const wrapper = page.locator('span', { has: page.locator('awd-avatar') });
  const avatar = page.locator('awd-avatar');
  const badge = new NgnBadgeHarness(wrapper);
  await badge.expectVisible(true);
  await badge.expectText('5');

  // Anchored near the avatar's top-right, not escaped to the viewport corner
  // (the original bug), and not clipped away (the avatar-overflow bug).
  const avatarBox = await avatar.boundingBox();
  const badgeBox = await badge.badge.boundingBox();
  if (!avatarBox || !badgeBox) {
    throw new Error('avatar or badge has no bounding box');
  }
  const badgeCx = badgeBox.x + badgeBox.width / 2;
  const badgeCy = badgeBox.y + badgeBox.height / 2;
  expect(badgeCx).toBeGreaterThan(avatarBox.x);
  expect(badgeCx).toBeLessThanOrEqual(avatarBox.x + avatarBox.width + 2);
  expect(badgeCy).toBeGreaterThanOrEqual(avatarBox.y - 2);
  expect(badgeCy).toBeLessThan(avatarBox.y + avatarBox.height);

  await expectScreenshot(page, testInfo, 'on-avatar');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<button type="button" style="width:48px;height:48px" [ngnBadge]="inputs().value">Inbox</button>`,
      imports: ['badge'],
    },
    { inputs: { value: 5 } }
  );

  const badge = new NgnBadgeHarness(page.locator('button'));
  await badge.expectText('5');
  await expectNoA11yViolations(page);
});
