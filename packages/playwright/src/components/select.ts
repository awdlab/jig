import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { selectControlTemplate } from '@awdlab/jig-themes/templates/select';
import { AwdInputHarness } from './input';
import { NGN_CLASSES } from '../utils/classes';
import { AwdListBoxHarness } from './list-box';
import { AwdInputFieldHarness } from './input-field';
import { JigItemViewHarness } from './item-view';

export class AwdSelectHarness {
  public readonly classes = themeClasses(selectControlTemplate);
  public readonly filter: AwdInputFieldHarness<{ input: AwdInputHarness }>;
  public readonly filterIcon: Locator;
  public readonly icon: Locator;
  public readonly input: Locator;
  public readonly inputEditable: AwdInputHarness;
  public readonly listBox: AwdListBoxHarness;
  public readonly popoverContent: Locator;
  public readonly multipleItemView: JigItemViewHarness;

  constructor(public locator: Locator) {
    this.filter = new AwdInputFieldHarness(locator.locator(this.classes['filter']['root']), l => ({
      input: new AwdInputHarness(l.locator(NGN_CLASSES.input['root'])),
    }));
    this.filterIcon = locator.locator(this.classes['filter-icon']);
    this.icon = locator.locator(this.classes['icon']);
    this.input = locator.locator(this.classes['input']);
    this.inputEditable = new AwdInputHarness(
      locator.locator(`${this.classes['input-editable']} ${NGN_CLASSES.input['root']}`)
    );
    this.listBox = new AwdListBoxHarness(locator.locator(this.classes['list-box']['root']));
    this.popoverContent = locator.locator(this.classes['popover-content']);
    this.multipleItemView = new JigItemViewHarness(locator.locator('jig-item-view'));
  }

  public async expectOpened(opened = true) {
    // Gate on the trigger's `aria-expanded` (bound to `popover.open()`), not just
    // content visibility. `open()` is only set once the native popover has
    // actually toggled in the top layer, whereas the content becomes CSS-visible
    // a frame earlier — before the popover is a dismissible top-layer element.
    // Waiting on visibility alone lets a follow-up keypress (e.g. Escape) race
    // the open transition under load and get lost, leaving the popover stuck
    // open. The `aria-expanded`/`aria-haspopup` attributes live on the inner
    // combobox/input trigger, not the outer `input` wrapper.
    const trigger = this.locator.locator('[aria-haspopup="listbox"]');
    await expect(trigger).toHaveAttribute('aria-expanded', String(opened));
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

  public async expectSelectedItemText(text: string, editable = false) {
    if (editable) {
      await this.inputEditable.expectValue(text);
    } else {
      await expect(this.input).toHaveText(text, { useInnerText: true });
    }
  }

  public async clickItemByText(text: string, expectClosed = true) {
    await this.listBox.scroller.clickItemByText(text);
    if (expectClosed) {
      await this.expectOpened(false);
    }
  }

  public async clickItemByIndex(index: number, expectClosed = true) {
    await this.listBox.scroller.clickItemByIndex(index);
    if (expectClosed) {
      await this.expectOpened(false);
    }
  }
}
