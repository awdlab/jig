import { snackbarControlTemplate } from '@awdlab/jig-themes/templates/snackbar';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator, type Page } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigSnackbarHarness extends JigHarness {
  public readonly classes = themeClasses(snackbarControlTemplate);

  public readonly header: Locator;
  public readonly content: Locator;
  public readonly icon: Locator;
  public readonly closeButton: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.header = locator.locator(this.classes.defaultHeader);
    this.content = locator.locator(this.classes.defaultContent);
    this.icon = this.header.locator('jig-icon').first();
    // The close button is a direct child of the snackbar root (sibling of the body), not inside
    // the header. It is the only <button> in the snackbar, so match it directly.
    this.closeButton = locator.locator('button');
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

export class JigSnackbarHostHarness extends JigHarness {
  public readonly classes = themeClasses(snackbarControlTemplate);

  constructor(page: Page) {
    super(page.locator('jig-snackbar-host'));
  }

  public getSnackbar(index: number = 0): JigSnackbarHarness {
    return new JigSnackbarHarness(this.locator.locator('jig-snackbar').nth(index));
  }

  public getAllSnackbars(): Locator {
    return this.locator.locator('jig-snackbar');
  }

  public async expectSnackbarCount(count: number) {
    await expect(this.getAllSnackbars()).toHaveCount(count);
  }
}
