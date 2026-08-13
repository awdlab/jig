import { expect, type Locator } from '@playwright/test';
import { drawerControlTemplate } from '@awdlab/jig-themes/templates/drawer';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

export class JigDrawerHarness extends JigHarness {
  public readonly classes = themeClasses(drawerControlTemplate);

  public readonly header: Locator;
  public readonly headerText: Locator;
  public readonly content: Locator;
  public readonly footer: Locator;
  public readonly closeButton: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.header = locator.locator(this.classes.header);
    this.headerText = locator.locator(this.classes['default-header-text']);
    this.content = locator.locator(this.classes.content);
    this.footer = locator.locator(this.classes.footer);
    this.closeButton = this.header.locator('button');
  }

  /** The drawer is a popover: closing animates out, so this waits for the leave to finish. */
  public async expectOpened(opened = true): Promise<void> {
    await expect(this.locator).toBeVisible({ visible: opened });
  }

  public async expectModal(modal = true): Promise<void> {
    if (modal) {
      await expect(this.locator).toHaveAttribute('role', 'dialog');
      await expect(this.locator).toHaveAttribute('aria-modal', 'true');
    } else {
      await expect(this.locator).toHaveAttribute('role', 'complementary');
    }
  }

  public expectPosition(
    position: 'top' | 'end' | 'bottom' | 'start' | 'fullscreen'
  ): Promise<void> {
    return expect(this.locator).toHaveAttribute('data-position', position);
  }

  public async close(): Promise<void> {
    await this.closeButton.click();
    await this.expectOpened(false);
  }
}
