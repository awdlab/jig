import { uploadControlTemplate } from '@awdlab/jig-themes/templates/upload';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigUploadHarness extends JigHarness {
  public readonly classes = themeClasses(uploadControlTemplate);

  public readonly zone: Locator;
  public readonly input: Locator;
  public readonly list: Locator;
  public readonly items: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.zone = locator.locator(this.classes.zone);
    this.input = locator.locator('input[type=file]');
    this.list = locator.locator(this.classes.list);
    this.items = this.list.locator(this.classes.item);
  }

  /** Item `<li>` at the given index. */
  public getItemByIndex(index: number = 0): Locator {
    return this.items.nth(index);
  }

  public getNameByIndex(index: number = 0): Locator {
    return this.getItemByIndex(index).locator(this.classes.name);
  }

  public async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  public async expectItemName(index: number, text: string): Promise<void> {
    await expect(this.getNameByIndex(index)).toHaveText(text);
  }

  public async expectItemState(
    index: number,
    state: 'pending' | 'uploading' | 'done' | 'failed'
  ): Promise<void> {
    const stateClass = this.classes[`item-${state}`].slice(1); // strip leading '.'
    await expect(this.getItemByIndex(index)).toHaveClass(new RegExp(stateClass));
  }

  /** Select files through the projected native input (click-select path). */
  public async selectFiles(
    files: Array<{ name: string; mimeType: string; buffer: Buffer }>
  ): Promise<void> {
    await this.input.setInputFiles(files);
  }

  /** Action button ('upload' | 'cancel' | 'retry' | 'remove') on an item. */
  public getActionButtonByIndex(index: number, label: string): Locator {
    return this.getItemByIndex(index).getByLabel(new RegExp(`^${label}`, 'i'));
  }

  /** The "Upload" button rendered in confirm mode (`confirmTrigger: 'all'`). */
  public uploadAllButton(): Locator {
    return this.locator.locator(this.classes.trigger);
  }
}
