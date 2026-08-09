import { uploadControlTemplate } from '@awdlab/jig-themes/templates/upload';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class JigUploadHarness {
  public readonly classes = themeClasses(uploadControlTemplate);

  public readonly locator: Locator;
  public readonly zone: Locator;
  public readonly input: Locator;
  public readonly list: Locator;
  public readonly items: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.zone = locator.locator(this.classes.zone);
    this.input = locator.locator('input[type=file]');
    this.list = locator.locator(this.classes.list);
    this.items = this.list.locator(this.classes.item);
  }

  /** Item `<li>` at the given index. */
  public item(index: number = 0): Locator {
    return this.items.nth(index);
  }

  public name(index: number = 0): Locator {
    return this.item(index).locator(this.classes.name);
  }

  public async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  public async expectItemName(index: number, text: string): Promise<void> {
    await expect(this.name(index)).toHaveText(text);
  }

  public async expectItemState(
    index: number,
    state: 'pending' | 'uploading' | 'done' | 'failed'
  ): Promise<void> {
    const stateClass = this.classes[`item-${state}`].slice(1); // strip leading '.'
    await expect(this.item(index)).toHaveClass(new RegExp(stateClass));
  }

  /** Select files through the projected native input (click-select path). */
  public async selectFiles(
    files: Array<{ name: string; mimeType: string; buffer: Buffer }>
  ): Promise<void> {
    await this.input.setInputFiles(files);
  }

  /** Action button ('upload' | 'cancel' | 'retry' | 'remove') on an item. */
  public actionButton(index: number, label: string): Locator {
    return this.item(index).getByLabel(new RegExp(`^${label}`, 'i'));
  }

  /** The "Upload" button rendered in confirm mode (`confirmTrigger: 'all'`). */
  public uploadAllButton(): Locator {
    return this.locator.locator(this.classes.trigger);
  }
}
