import { expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';
import { JigHarness } from '../harness.js';

export class JigInputHarness extends JigHarness {
  public readonly classes = themeClasses(inputControlTemplate);

  public expectValue(value: string): Promise<void> {
    return expect(this.locator).toHaveValue(value);
  }
  public clear(): Promise<void> {
    return this.locator.clear();
  }

  public fill(value: string): Promise<void> {
    return this.locator.fill(value);
  }

  public pressSequentially(text: string): Promise<void> {
    return this.locator.pressSequentially(text, { delay: 5 });
  }

  public override press(key: string): Promise<void> {
    return this.locator.press(key);
  }
}
