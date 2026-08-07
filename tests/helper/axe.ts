import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/**
 * Runs axe-core against the currently loaded component and asserts there are no
 * accessibility violations.
 *
 * Scans the WCAG 2.0/2.1/2.2 A + AA rule sets — the conformance target the
 * library advertises. One rule is disabled by default: `region`, because the
 * test wrapper renders a single control with no landmark wrapper.
 *
 * Pass extra rule ids to {@link disableRules} to relax further, or a CSS
 * selector to {@link include} to scope the scan to a subtree.
 */
export async function expectNoA11yViolations(
  page: Page,
  options?: { include?: string; disableRules?: string[] }
): Promise<void> {
  const disabled = ['region', ...(options?.disableRules ?? [])];
  let builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
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
