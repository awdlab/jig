import { expect, type Locator } from '@playwright/test';
import { commandControlTemplate } from '@awdlab/jig-themes/templates/command';
import { themeClasses } from '../utils/theme.js';
import { JIG_CLASSES } from '../utils/classes.js';
import { JigHarness } from '../harness.js';
import { JigDialogHarness } from './dialog.js';
import { JigInputHarness } from './input.js';
import { JigListBoxHarness } from './list-box.js';

export class JigCommandHarness extends JigHarness {
  public readonly classes = themeClasses(commandControlTemplate);

  public readonly dialog: JigDialogHarness;
  public readonly search: JigInputHarness;
  public readonly listBox: JigListBoxHarness;
  public readonly items: Locator;
  public readonly empty: Locator;
  public readonly hints: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.dialog = new JigDialogHarness(locator.locator(this.classes.dialog['root']));
    this.search = new JigInputHarness(
      locator.locator(`${this.classes.search['root']} ${JIG_CLASSES.input['root']}`)
    );
    this.listBox = new JigListBoxHarness(locator.locator(this.classes['list-box']['root']));
    this.items = locator.locator(this.classes.item);
    this.empty = locator.locator(this.classes.empty);
    this.hints = locator.locator(this.classes.hint);
  }

  public expectOpened(opened = true): Promise<void> {
    return this.dialog.expectOpened(opened);
  }

  /** Type into the search field, one key at a time so the filter runs per keystroke. */
  public async filter(text: string): Promise<void> {
    await this.search.locator.click();
    await this.search.pressSequentially(text);
  }

  public expectItemCount(count: number): Promise<void> {
    return expect(this.listBox.item).toHaveCount(count);
  }

  public expectItemLabels(labels: string[]): Promise<void> {
    return expect(this.locator.locator(this.classes['item-label'])).toHaveText(labels);
  }

  public expectEmpty(empty = true): Promise<void> {
    return expect(this.empty).toBeVisible({ visible: empty });
  }

  public clickItem(label: string): Promise<void> {
    return this.page.getByRole('option', { name: label }).click();
  }

  public expectActiveItem(label: string): Promise<void> {
    return expect(this.listBox.itemHighlighted).toHaveText(new RegExp(label));
  }
}
