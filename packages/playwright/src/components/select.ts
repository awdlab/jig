import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { selectControlTemplate } from '@awdlab/jig-themes/templates/select';
import { JigInputHarness } from './input.js';
import { JIG_CLASSES } from '../utils/classes.js';
import { JigDropdownListHarness } from './dropdown-list.js';
import { JigListBoxHarness } from './list-box.js';
import { JigInputFieldHarness } from './input-field.js';
import { JigItemViewHarness } from './item-view.js';
import { JigHarness } from '../harness.js';

export class JigSelectHarness extends JigHarness {
  public readonly classes = themeClasses(selectControlTemplate);
  public readonly filter: JigInputFieldHarness<{ input: JigInputHarness }>;
  public readonly filterIcon: Locator;
  public readonly icon: Locator;
  public readonly input: Locator;
  public readonly inputEditable: JigInputHarness;
  /** The dropdown the select builds its list on. */
  public readonly dropdown: JigDropdownListHarness;
  public readonly multipleItemView: JigItemViewHarness;

  constructor(locator: Locator) {
    super(locator);
    this.filter = new JigInputFieldHarness(locator.locator(this.classes['filter']['root']), l => ({
      input: new JigInputHarness(l.locator(JIG_CLASSES.input['root'])),
    }));
    this.filterIcon = locator.locator(this.classes['filter-icon']);
    this.icon = locator.locator(this.classes['icon']);
    this.input = locator.locator(this.classes['input']);
    this.inputEditable = new JigInputHarness(
      locator.locator(`${this.classes['input-editable']} ${JIG_CLASSES.input['root']}`)
    );
    this.dropdown = new JigDropdownListHarness(locator.locator(this.classes['dropdown']['root']));
    this.multipleItemView = new JigItemViewHarness(locator.locator('jig-item-view'));
  }

  /** The list box, now owned by the dropdown. */
  public get listBox(): JigListBoxHarness {
    return this.dropdown.listBox;
  }

  /** The dropdown's content wrapper, formerly the select's own `popover-content`. */
  public get popoverContent(): Locator {
    return this.dropdown.content;
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
