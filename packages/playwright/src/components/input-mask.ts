import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

/**
 * Playwright harness for `ngn-input-mask` (v2).
 *
 * ## Value assertion
 * The control's `value` model (the serialized string, or `null` when incomplete)
 * is NOT written into any DOM element — the proxy input stays empty at all times.
 * E2E tests must assert the emitted value via a bound echo element rendered by the
 * test component (e.g. `<span data-testid="value">{{ inputs().value }}</span>`).
 * This harness intentionally does NOT expose an `expectValue` method.
 */
export class NgnInputMaskHarness {
  public readonly classes = themeClasses(inputMaskControlTemplate);

  /**
   * The visually-hidden proxy input — this is the element that receives focus
   * and keyboard events. All `press` / `pressSequentially` calls target it.
   */
  public readonly proxy: Locator;

  /**
   * All `[role="spinbutton"]` section spans (both filled and placeholder state).
   */
  public readonly sections: Locator;

  constructor(private readonly locator: Locator) {
    // The proxy is the only <input> inside the control.
    this.proxy = locator.locator('input').first();
    this.sections = locator.locator('[role="spinbutton"]');
  }

  /** Focus the proxy input so subsequent key events are delivered to the control. */
  public async focus(): Promise<void> {
    await this.proxy.focus();
  }

  /** Press a single key on the proxy input (e.g. 'ArrowRight', 'Backspace', '1'). */
  public async press(key: string): Promise<void> {
    await this.proxy.focus();
    await this.proxy.press(key);
  }

  /** Type a string of characters into the proxy input one by one, with a small delay. */
  public async pressSequentially(text: string): Promise<void> {
    await this.proxy.focus();
    await this.proxy.pressSequentially(text, { delay: 5 });
  }

  /**
   * Assert the visible rendered text of the control — the concatenation (with no
   * separator) of all section, section-placeholder, and separator spans in DOM order.
   * Screen-reader-only (`sr-only`) spans are excluded.
   *
   * Example: for a time mask `HH:MM:SS` with `12` entered in the first section
   * the visible text is `'12:MM:SS'`.
   *
   * Uses Playwright's auto-retry (`expect.poll`) so it waits for Angular to render.
   */
  public expectText(visible: string): Promise<void> {
    const visibleSelector = [
      this.classes['section'],
      this.classes['section-placeholder'],
      this.classes.separator,
    ].join(', ');

    return expect
      .poll(async () => {
        const texts = await this.locator.locator(visibleSelector).allInnerTexts();
        return texts.join('');
      })
      .toEqual(visible);
  }

  /**
   * Returns the value of `aria-activedescendant` from the proxy input, which
   * is the `id` of the currently focused section span. Returns `null` when the
   * attribute is absent.
   */
  public async activeDescendantId(): Promise<string | null> {
    const val = await this.proxy.getAttribute('aria-activedescendant');
    return val ?? null;
  }

  /**
   * Assert the innerText of the currently active section span.
   * Useful for verifying which section is focused and what value it shows.
   */
  public async expectActiveText(text: string): Promise<void> {
    const id = await this.activeDescendantId();
    if (id === null) {
      throw new Error('No aria-activedescendant on proxy — no active section');
    }
    const activeSpan = this.locator.locator(`#${id}`);
    await expect(activeSpan).toHaveText(text, { useInnerText: true });
  }

  /**
   * Clear all sections by focusing the proxy, pressing Home to jump to the first
   * section, then pressing Backspace twice per section (once to clear the value,
   * once to step back if it was already empty — harmless no-op).
   *
   * This is intentionally blunt: it over-presses rather than inspecting state.
   */
  public async clear(): Promise<void> {
    await this.proxy.focus();
    // Start from the LAST section: Backspace clears the active section then steps
    // to the previous one, so walking from the end clears every section. Starting
    // from Home would get stuck on section 0 (Backspace there is a no-op).
    await this.proxy.press('End');
    const count = await this.sections.count();
    for (let i = 0; i < count; i++) {
      await this.proxy.press('Backspace');
      await this.proxy.press('Backspace');
    }
  }
}
