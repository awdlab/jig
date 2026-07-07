import { stateControlTemplate } from '@ngneers/controls-themes/templates/state';
import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { NgnSpinnerHarness } from './spinner';

export class NgnStateHarness {
  public readonly classes = themeClasses(stateControlTemplate);

  public readonly indicator: Locator;
  public readonly icon: Locator;
  public readonly spinner: NgnSpinnerHarness;

  constructor(public readonly locator: Locator) {
    this.indicator = locator.locator(this.classes.indicator);
    this.icon = locator.locator('ngn-icon');
    this.spinner = new NgnSpinnerHarness(locator.locator('ngn-spinner'));
  }

  public async expectLoading() {
    await expect(this.locator).toBeVisible();
    await this.spinner.expectVisible();
    await expect(this.icon).toHaveCount(0);
  }

  public async expectIcon(kind: string) {
    await expect(this.locator).toBeVisible();
    await expect(this.locator).toHaveClass(
      new RegExp(`(^|\\s)ngn-state-kind-${escapeRegExp(kind)}(\\s|$)`)
    );
    await expect(this.icon).toBeVisible();
    await expect(this.spinner.locator).toHaveCount(0);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
