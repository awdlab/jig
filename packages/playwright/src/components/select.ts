import { expect, Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';
import { NgnInputHarness } from './input';
import { NGN_CLASSES } from '../utils/classes';
import { NgnListBoxHarness } from './list-box';
import { NgnInputFieldHarness } from './input-field';

export class NgnSelectHarness {
  public readonly classes = themeClasses(selectControlTemplate);
  public readonly filter: NgnInputFieldHarness<{ input: NgnInputHarness }>;
  public readonly filterIcon: Locator;
  public readonly icon: Locator;
  public readonly input: Locator;
  public readonly inputEditable: NgnInputHarness;
  public readonly listBox: NgnListBoxHarness;
  public readonly popoverContent: Locator;

  constructor(public locator: Locator) {
    this.filter = new NgnInputFieldHarness(locator.locator(this.classes['filter']), l => ({
      input: new NgnInputHarness(l.locator(NGN_CLASSES.input[''])),
    }));
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

  public async selectedItemText(text: string, editable = false) {
    if (editable) {
      await this.inputEditable.expectValue(text);
    } else {
      await expect(this.input).toHaveText(text);
    }
  }
}
