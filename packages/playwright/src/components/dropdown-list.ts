import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { dropdownListControlTemplate } from '@awdlab/jig-themes/templates/dropdown-list';
import { JigListBoxHarness } from './list-box.js';
import { JigHarness } from '../harness.js';

export class JigDropdownListHarness extends JigHarness {
  public readonly classes = themeClasses(dropdownListControlTemplate);
  /** The popover's positioned wrapper — the element `sizeConstraints` sizes. */
  public readonly popover: Locator;
  public readonly content: Locator;
  public readonly header: Locator;
  public readonly listBox: JigListBoxHarness;

  constructor(locator: Locator) {
    super(locator);
    this.popover = locator.locator(this.classes['popover']['wrapper']);
    this.content = locator.locator(this.classes['content']);
    this.header = locator.locator(this.classes['header']);
    this.listBox = new JigListBoxHarness(locator.locator(this.classes['list-box']['root']));
  }

  public async expectOpened(opened = true): Promise<void> {
    await expect(this.content).toBeVisible({ visible: opened });
  }

  public async close(): Promise<void> {
    await this.locator.page().keyboard.press('Escape');
    await this.expectOpened(false);
  }
}
