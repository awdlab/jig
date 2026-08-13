import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { switchControlTemplate } from '@awdlab/jig-themes/templates/switch';
import { JigHarness } from '../harness.js';

export class JigSwitchHarness extends JigHarness {
  public readonly classes = themeClasses(switchControlTemplate);

  public readonly input: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.input = locator.locator(this.classes.input);
  }

  public async toggle(force = false) {
    await this.input.click({ force });
  }

  public async expectValue(value: boolean) {
    if (value) {
      await expect(this.input).toBeChecked();
    } else {
      await expect(this.input).not.toBeChecked();
    }
  }

  public override async expectDisabled(disabled: boolean) {
    if (disabled) {
      await expect(this.input).toBeDisabled();
    } else {
      await expect(this.input).not.toBeDisabled();
    }
  }

  public override async expectReadonly(readonly: boolean) {
    if (readonly) {
      await expect(this.input).toHaveAttribute('aria-readonly');
    } else {
      await expect(this.input).not.toHaveAttribute('aria-readonly');
    }
  }
}
