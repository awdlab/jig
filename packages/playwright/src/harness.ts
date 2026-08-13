import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Attribute shapes a themed control uses to express a state. A control may put them on its host
 * or on an inner interactive element (a native `<input>`, a `<button>`), so both are matched.
 */
const STATE_SELECTORS = {
  disabled: ':disabled, [disabled], [aria-disabled]:not([aria-disabled="false"])',
  // Controls bind the ARIA flags to `''` rather than `'true'`, so presence is what counts.
  readonly: '[readonly], [aria-readonly]:not([aria-readonly="false"])',
  invalid: '[aria-invalid]:not([aria-invalid="false"])',
  required: '[required], [aria-required]:not([aria-required="false"])',
} as const;

/** A state {@link JigHarness.expectState} can assert. */
export type JigHarnessState = keyof typeof STATE_SELECTORS;

/**
 * Base class for every control harness: the host `Locator` plus the interactions and assertions
 * that mean the same thing for all controls. Also usable directly for a control that has no
 * dedicated harness yet.
 */
export class JigHarness {
  public readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  public get page(): Page {
    return this.locator.page();
  }

  public click(options?: Parameters<Locator['click']>[0]): Promise<void> {
    return this.locator.click(options);
  }

  public hover(options?: Parameters<Locator['hover']>[0]): Promise<void> {
    return this.locator.hover(options);
  }

  public focus(): Promise<void> {
    return this.locator.focus();
  }

  public blur(): Promise<void> {
    return this.locator.blur();
  }

  public press(key: string, options?: Parameters<Locator['press']>[1]): Promise<void> {
    return this.locator.press(key, options);
  }

  public expectVisible(visible = true): Promise<void> {
    return expect(this.locator).toBeVisible({ visible });
  }

  public expectAttached(attached = true): Promise<void> {
    return expect(this.locator).toBeAttached({ attached });
  }

  public expectText(text: string | RegExp): Promise<void> {
    return expect(this.locator).toHaveText(text, { useInnerText: true });
  }

  /** Passes when the host is focused or contains the focused element. */
  public expectFocused(focused = true): Promise<void> {
    return expect(async () => {
      const hasFocus = await this.locator.evaluate(
        el => el === document.activeElement || el.contains(document.activeElement)
      );
      expect(hasFocus).toBe(focused);
    }).toPass();
  }

  public expectDisabled(disabled = true): Promise<void> {
    return this.expectState('disabled', disabled);
  }

  public expectReadonly(readonly = true): Promise<void> {
    return this.expectState('readonly', readonly);
  }

  public expectInvalid(invalid = true): Promise<void> {
    return this.expectState('invalid', invalid);
  }

  public expectRequired(required = true): Promise<void> {
    return this.expectState('required', required);
  }

  /** Asserts `state` on the host element or on any element inside it. */
  public expectState(state: JigHarnessState, present = true): Promise<void> {
    const selector = STATE_SELECTORS[state];
    return expect(async () => {
      const matches = await this.locator.evaluate(
        (el, sel) => el.matches(sel) || !!el.querySelector(sel),
        selector
      );
      expect(matches).toBe(present);
    }).toPass();
  }
}
