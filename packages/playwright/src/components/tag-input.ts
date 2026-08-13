import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { tagInputControlTemplate } from '@awdlab/jig-themes/templates/tag-input';
import { JIG_CLASSES } from '../utils/classes.js';
import { JigDropdownListHarness } from './dropdown-list.js';
import { JigInputHarness } from './input.js';
import { JigHarness } from '../harness.js';

export class JigTagInputHarness extends JigHarness {
  public readonly classes = themeClasses(tagInputControlTemplate);
  /** The field wrapper — the horizontal scroll container in single-line mode. */
  public readonly field: Locator;
  /** The tag row. */
  public readonly tagList: Locator;
  /** The text field tags are typed into. */
  public readonly input: JigInputHarness;
  /** The visually hidden live region. */
  public readonly liveRegion: Locator;
  /** The suggestion dropdown. Only present when `suggestions` is set. */
  public readonly dropdown: JigDropdownListHarness;

  constructor(locator: Locator) {
    super(locator);
    this.field = locator.locator(this.classes['field']);
    this.tagList = locator.locator(this.classes['tags']);
    this.input = new JigInputHarness(locator.locator(JIG_CLASSES.input['root']));
    this.liveRegion = locator.locator(this.classes['live-region']);
    this.dropdown = new JigDropdownListHarness(locator.locator(this.classes['dropdown']['root']));
  }

  public get tags(): Locator {
    return this.locator.locator(this.classes['tag']);
  }

  public tag(index: number): Locator {
    return this.tags.nth(index);
  }

  public removeButton(index: number): Locator {
    return this.tag(index).locator(this.classes['tag-remove']);
  }

  public async expectTags(labels: string[]): Promise<void> {
    await expect(this.tags).toHaveCount(labels.length);
    for (const [index, label] of labels.entries()) {
      await expect(this.tag(index)).toContainText(label);
    }
  }

  public async expectAnnouncement(text: string): Promise<void> {
    await expect(this.liveRegion).toHaveText(text);
  }

  /** Types `text` into the field, one key at a time so delimiters fire. */
  public async type(text: string): Promise<void> {
    await this.input.locator.click();
    await this.input.pressSequentially(text);
  }
}
