import { toastControlTemplate } from '@awdlab/jig-themes/templates/toast';
import { themeClasses } from '../utils/theme';
import test, { expect, type Locator, type Page } from '@playwright/test';

export class AwdToastHarness {
  public readonly classes = themeClasses(toastControlTemplate);

  public readonly locator: Locator;
  public readonly header: Locator;
  public readonly content: Locator;
  public readonly icon: Locator;
  public readonly closeButton: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.header = locator.locator(this.classes.defaultHeader);
    this.content = locator.locator(this.classes.defaultContent);
    this.icon = this.header.locator('jig-icon').first();
    this.closeButton = this.header.locator('button');
  }

  public async expectVisible() {
    await expect(this.locator).toBeVisible();
  }

  public async expectHidden() {
    await expect(this.locator).not.toBeVisible();
  }

  public async expectHeader(text: string) {
    await expect(this.header).toContainText(text);
  }

  public async expectContent(text: string) {
    await expect(this.content).toContainText(text);
  }

  public async expectIcon(hasIcon: boolean) {
    if (hasIcon) {
      await expect(this.icon).toBeVisible();
    } else {
      await expect(this.icon).not.toBeVisible();
    }
  }

  public async expectClosable(closable: boolean) {
    if (closable) {
      await expect(this.closeButton).toBeVisible();
    } else {
      await expect(this.closeButton).not.toBeVisible();
    }
  }

  public async close() {
    await this.closeButton.click();
  }
}

export class AwdToastHostHarness {
  public readonly classes = themeClasses(toastControlTemplate);
  public readonly locator: Locator;

  constructor(page: Page) {
    this.locator = page.locator('jig-toast-host');
  }

  public getToast(index: number = 0): AwdToastHarness {
    return new AwdToastHarness(this.locator.locator('jig-toast').nth(index));
  }

  public getAllToasts(): Locator {
    return this.locator.locator('jig-toast');
  }

  public async expectToastCount(count: number) {
    await expect(this.getAllToasts()).toHaveCount(count);
  }

  public async expectVisible() {
    await expect(this.locator).toBeVisible();
  }
}
