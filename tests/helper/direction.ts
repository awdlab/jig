import test, { type Page } from '@playwright/test';

/**
 * Render everything the page loads from here on right-to-left.
 *
 * Registered as an init script rather than set after load, so the control's very
 * first paint is already RTL — a screenshot can never catch an LTR frame. Applies
 * to whatever loader the test uses, so it composes with per-file helpers as well
 * as {@link loadComponent}.
 *
 * Call it BEFORE the component is loaded.
 */
export async function useRtl(page: Page): Promise<void> {
  await test.step('Use RTL', async () => {
    await page.addInitScript(() => {
      const apply = () => document.documentElement.setAttribute('dir', 'rtl');
      // At document-start the root element may not exist yet.
      if (document.documentElement) {
        apply();
      } else {
        document.addEventListener('DOMContentLoaded', apply);
      }
    });
  });
}
