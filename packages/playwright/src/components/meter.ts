import { expect, type Locator } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { meterControlTemplate } from '@awdlab/jig-themes/templates/meter';

export class JigMeterHarness {
  public readonly classes = themeClasses(meterControlTemplate);

  public readonly locator: Locator;
  public readonly track: Locator;
  public readonly segments: Locator;
  public readonly legend: Locator;
  public readonly items: Locator;
  public readonly values: Locator;
  public readonly icons: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.track = locator.locator(this.classes.track);
    this.segments = locator.locator(this.classes.segment);
    this.legend = locator.locator(this.classes.legend);
    this.items = locator.locator(this.classes.item);
    this.values = locator.locator(this.classes.value);
    this.icons = locator.locator(this.classes.icon);
  }

  public async expectVisible() {
    await expect(this.locator).toBeVisible();
  }

  public async expectSegmentCount(count: number) {
    await expect(this.segments).toHaveCount(count);
  }

  /** Asserts the segment's rendered share of the total, as the percentage it was sized with. */
  public async expectSegmentSize(index: number, percentage: number) {
    await expect(this.segments.nth(index)).toHaveAttribute(
      'style',
      new RegExp(`--meter-size:\\s*${percentage}%`)
    );
  }

  public async expectLabels(labels: string[]) {
    await expect(this.locator.locator(this.classes.label)).toHaveText(labels);
  }

  public async expectPercentages(percentages: string[]) {
    await expect(this.values).toHaveText(percentages);
  }

  public async expectPercentagesHidden() {
    await expect(this.values).toHaveCount(0);
  }

  /** Asserts the hover pairing marks exactly this index — on the segment and its legend entry. */
  public async expectHighlighted(index: number) {
    await expect(this.segments.nth(index)).toHaveClass(
      new RegExp(this.classes.highlighted.slice(1))
    );
    await expect(this.items.nth(index)).toHaveClass(new RegExp(this.classes.highlighted.slice(1)));
    await expect(this.locator.locator(this.classes.highlighted)).toHaveCount(2);
  }

  public async expectNoHighlight() {
    await expect(this.locator.locator(this.classes.highlighted)).toHaveCount(0);
  }
}
