import { stepperControlTemplate } from '@awdlab/jig-themes/templates/stepper';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigStepperHarness extends JigHarness {
  public readonly classes = themeClasses(stepperControlTemplate);
  public readonly steps: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.steps = locator.locator(this.classes.step);
  }

  public async expectActive(index: number) {
    await expect(this.steps.nth(index)).toHaveAttribute('aria-selected', 'true');
  }

  public async selectStep(index: number) {
    // `force: true`: a linear-gated step is marked `aria-disabled` (not native
    // `disabled`) so Playwright's actionability check would otherwise refuse
    // the click. The click must still reach the component — its own
    // `canGoTo`/`goTo` logic decides whether navigation actually happens.
    await this.steps.nth(index).click({ force: true });
  }

  public async expectStepDisabled(index: number, disabled: boolean) {
    if (disabled) {
      await expect(this.steps.nth(index)).toBeDisabled();
    } else {
      await expect(this.steps.nth(index)).toBeEnabled();
    }
  }
}
