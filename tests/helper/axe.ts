import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/**
 * Runs axe-core against the currently loaded component and asserts there are no
 * accessibility violations.
 *
 * Scans the WCAG 2.0/2.1 A + AA rule sets. Two rules are disabled by default
 * because they report on the bare test-wrapper environment or on theme polish
 * rather than on control markup:
 * - `region` — the test wrapper renders a single control with no landmark
 *   wrapper, which is irrelevant to the control's own accessibility.
 * - `color-contrast` — contrast is a property of the active theme, validated
 *   separately; it must not gate structural/ARIA correctness of the controls.
 *
 * Pass extra rule ids to {@link disableRules} to relax further, or a CSS
 * selector to {@link include} to scope the scan to a subtree.
 */
export async function expectNoA11yViolations(
  page: Page,
  options?: { include?: string; disableRules?: string[] }
): Promise<void> {
  const disabled = ['region', 'color-contrast', ...(options?.disableRules ?? [])];
  let builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules(disabled);
  if (options?.include) {
    builder = builder.include(options.include);
  }
  const results = await builder.analyze();
  expect(
    results.violations,
    results.violations.map(v => `${v.id}: ${v.help} (${v.nodes.length} node(s))`).join('\n')
  ).toEqual([]);
}
