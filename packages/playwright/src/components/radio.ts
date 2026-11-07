import { type Locator, expect } from '@playwright/test';
import { radioControlTemplate } from '@awdlab/jig-themes/templates/radio';
import { radioGroupControlTemplate } from '@awdlab/jig-themes/templates/radio-group';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

export class JigRadioHarness extends JigHarness {
  public readonly classes = themeClasses(radioControlTemplate);

  public expectChecked(checked = true): Promise<void> {
    return expect(this.locator).toHaveAttribute('aria-checked', String(checked));
  }
}

export class JigRadioGroupHarness extends JigHarness {
  public readonly classes = themeClasses(radioGroupControlTemplate);

  /** All radio options in the group, in DOM order. */
  public readonly radios: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.radios = locator.locator(themeClasses(radioControlTemplate).root);
  }

  public getRadioByIndex(index: number): JigRadioHarness {
    return new JigRadioHarness(this.radios.nth(index));
  }

  /** Click the radio at `index` to select it. */
  public async select(index: number, force = false) {
    await this.getRadioByIndex(index).click({ force });
  }

  public async expectSelected(index: number) {
    await this.getRadioByIndex(index).expectChecked();
  }

  public async expectNotSelected(index: number) {
    await this.getRadioByIndex(index).expectChecked(false);
  }

  public async expectRadioDisabled(index: number, disabled = true) {
    await this.getRadioByIndex(index).expectDisabled(disabled);
  }

  /** Focus the currently active radio (the group's single tab stop). */
  public async focusActive() {
    await this.radios.and(this.page.locator('[tabindex="0"]')).focus();
  }
}
