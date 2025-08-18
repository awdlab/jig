import { expect, Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';
import { NgnInputHarness } from './input';
import { NGN_CLASSES } from '../utils/classes';
import { NgnListBoxHarness } from './list-box';

export class NgnSelectHarness {
  public readonly classes = themeClasses(selectControlTemplate);
  public readonly filter: Locator;
  public readonly filterIcon: Locator;
  public readonly icon: Locator;
  public readonly input: Locator;
  public readonly inputEditable: NgnInputHarness;
  public readonly listBox: NgnListBoxHarness;
  public readonly popoverContent: Locator;

  constructor(public locator: Locator) {
    this.filter = locator.locator(this.classes['filter']);
    this.filterIcon = locator.locator(this.classes['filter-icon']);
    this.icon = locator.locator(this.classes['icon']);
    this.input = locator.locator(this.classes['input']);
    this.inputEditable = new NgnInputHarness(
      locator.locator(`${this.classes['input-editable']} ${NGN_CLASSES.input['']}`)
    );
    this.listBox = new NgnListBoxHarness(locator.locator(this.classes['list-box']));
    this.popoverContent = locator.locator(this.classes['popover-content']);
  }

  public async expectOpened(opened = true) {
    await expect(this.popoverContent).toBeVisible({ visible: opened });
  }

  public async open() {
    await this.icon.click();
    await this.expectOpened();
  }

  public async close() {
    await this.icon.click();
    await this.expectOpened(false);
  }
}
