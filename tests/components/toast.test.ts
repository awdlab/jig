import test, { expect, type Page } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { JigToastHostHarness } from '@awdlab/jig-playwright';
import { expectNoA11yViolations } from '../helper/axe';
import { expectScreenshot } from '../helper/screenshot';

// Toasts are created imperatively via `injectToastCreator()`. The `toastTrigger`
// helper component (apps/test-wrapper) wraps that call behind buttons so we can
// show/hide toasts from an e2e template. The host + region live at the app root,
// provided by `withToasts()` in the test-wrapper's app.config.
async function loadToastTrigger(page: Page, options: Record<string, unknown> = {}) {
  const handle = await loadComponent(
    page,
    {
      template: `<toast-trigger [options]="inputs().options" />`,
      imports: ['toastTrigger'],
    },
    { inputs: { options } }
  );
  const show = page.getByTestId('show-toast');
  const hide = page.getByTestId('hide-toast');
  const host = new JigToastHostHarness(page);
  return { handle, show, hide, host };
}

test('creates a toast with correct content and notification ARIA', async ({ page }) => {
  const { show, host } = await loadToastTrigger(page, {
    header: 'Notification',
    content: 'This is a basic toast message.',
    autoHide: false,
  });

  await host.expectToastCount(0);
  await show.click();
  await host.expectToastCount(1);

  const toast = host.getToast(0);
  await toast.expectVisible();
  await toast.expectHeader('Notification');
  await toast.expectContent('This is a basic toast message.');

  // ARIA: the host is a labelled region. Politeness derives from color (like
  // snackbar): with no semantic color a toast announces politely (role=status);
  // set `ariaLive` or an error/warning color for an assertive alert.
  await expect(host.locator).toHaveAttribute('role', 'region');
  await expect(host.locator).toHaveAttribute('aria-label', /.+/);
  await expect(toast.locator).toHaveAttribute('role', 'status');
  await expect(toast.locator).toHaveAttribute('aria-live', 'polite');
  await expect(toast.locator).toHaveAttribute('aria-atomic', 'true');
});

test('dismisses via the close button when closable', async ({ page }) => {
  const { show, host } = await loadToastTrigger(page, {
    header: 'Closable',
    content: 'Dismiss me.',
    autoHide: false,
    closable: true,
  });

  await show.click();
  const toast = host.getToast(0);
  await toast.expectClosable(true);

  await toast.close();
  await host.expectToastCount(0);
});

test('hides programmatically via the returned ref', async ({ page }) => {
  const { show, hide, host } = await loadToastTrigger(page, {
    header: 'Persistent',
    content: 'Stays until hidden.',
    autoHide: false,
  });

  await show.click();
  await host.expectToastCount(1);

  await hide.click();
  await host.expectToastCount(0);
});

test('auto-hides after the configured delay', async ({ page }) => {
  const { show, host } = await loadToastTrigger(page, {
    header: 'Auto',
    content: 'Goes away on its own.',
    autoHide: 300,
  });

  await show.click();
  await host.expectToastCount(1);
  // The auto-hide timer removes the toast without any interaction.
  await expect(host.getAllToasts()).toHaveCount(0, { timeout: 5000 });
});

test('keyboard: F6 focuses newest toast, arrows rove, Escape dismisses', async ({ page }) => {
  // Two persistent, closable toasts so we can exercise roving + Escape.
  const { show, host } = await loadToastTrigger(page, {
    content: 'Toast',
    autoHide: false,
    closable: true,
  });

  await show.click();
  await show.click();
  await host.expectToastCount(2);

  const first = host.getToast(0);
  const second = host.getToast(1);

  // F6 jumps focus into the region, onto the newest (last) toast.
  await page.keyboard.press('F6');
  await expect(second.locator).toBeFocused();

  // ArrowUp roves to the previous (older) toast.
  await page.keyboard.press('ArrowUp');
  await expect(first.locator).toBeFocused();

  // ArrowDown roves back to the newest.
  await page.keyboard.press('ArrowDown');
  await expect(second.locator).toBeFocused();

  // Escape dismisses the focused (closable) toast.
  await page.keyboard.press('Escape');
  await host.expectToastCount(1);
});

test('accessibility (axe)', async ({ page }) => {
  const { show, host } = await loadToastTrigger(page, {
    header: 'Notification',
    content: 'This is a basic toast message.',
    autoHide: false,
    closable: true,
  });

  // Toasts are created imperatively — the live region only has content once shown.
  await show.click();
  await host.expectToastCount(1);

  await expectNoA11yViolations(page);
});

test('visual', async ({ page }, testInfo) => {
  const { show, host } = await loadToastTrigger(page, {
    header: 'Notification',
    content: 'This is a basic toast message.',
    autoHide: false,
    closable: true,
  });

  await show.click();
  await host.expectToastCount(1);
  await host.getToast(0).expectVisible();

  await expectScreenshot(page, testInfo, 'toast');
});
