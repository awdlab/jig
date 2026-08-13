import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigSliderHarness extends JigHarness {
  public readonly classes = themeClasses(sliderControlTemplate);

  public readonly track: Locator;
  /** Every thumb — one in single mode, two in range mode. */
  public readonly thumbs: Locator;
  /** The single-mode thumb, or the lower handle in range mode. */
  public readonly thumb: Locator;
  /** The lower handle. Only present in range mode. */
  public readonly thumbStart: Locator;
  /** The upper handle in range mode, and the only thumb in single mode. */
  public readonly thumbEnd: Locator;
  public readonly fill: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.track = locator.locator(this.classes.track);
    this.thumbs = locator.locator(this.classes.thumb);
    this.thumb = this.thumbs.first();
    this.thumbStart = this.thumbs.first();
    this.thumbEnd = this.thumbs.last();
    this.fill = locator.locator(this.classes.fill);
  }

  public async expectValue(value: number) {
    await expect(this.locator).toHaveAttribute('aria-valuenow', value.toString());
  }

  /** Asserts the `[start, end]` pair reported by the two range thumbs. */
  public async expectRangeValue([start, end]: [number, number]) {
    await expect(this.thumbs).toHaveCount(2);
    await expect(this.thumbStart).toHaveAttribute('aria-valuenow', start.toString());
    await expect(this.thumbEnd).toHaveAttribute('aria-valuenow', end.toString());
  }

  public async expectMin(min: number) {
    await expect(this.locator).toHaveAttribute('aria-valuemin', min.toString());
  }

  public async expectMax(max: number) {
    await expect(this.locator).toHaveAttribute('aria-valuemax', max.toString());
  }

  public async expectOrientation(orientation: 'horizontal' | 'vertical') {
    await expect(this.locator).toHaveAttribute('aria-orientation', orientation);
  }

  public override async expectReadonly(readonly: boolean) {
    if (readonly) {
      await expect(this.locator).toHaveAttribute('aria-readonly', 'true');
      await expect(this.locator).toHaveAttribute('tabindex', '0');
    } else {
      await expect(this.locator).not.toHaveAttribute('aria-readonly');
    }
  }

  public override async expectDisabled(disabled: boolean) {
    if (disabled) {
      await expect(this.locator).toHaveAttribute('disabled');
      await expect(this.locator).toHaveAttribute('tabindex', '-1');
    } else {
      await expect(this.locator).not.toHaveAttribute('disabled');
    }
  }

  public async clickTrack(position: { x?: number; y?: number } = {}) {
    const box = await this.track.boundingBox();
    if (!box) {
      throw new Error('Track not found');
    }
    const x = position.x !== undefined ? box.x + position.x : box.x + box.width / 2;
    const y = position.y !== undefined ? box.y + position.y : box.y + box.height / 2;
    await this.track.click({ position: { x: x - box.x, y: y - box.y } });
  }

  public async dragThumb(delta: { x?: number; y?: number }, handle: 'start' | 'end' = 'end') {
    const target = handle === 'start' ? this.thumbStart : this.thumbEnd;
    await target.hover();
    await this.locator.page().mouse.down();
    const box = await target.boundingBox();
    if (!box) {
      throw new Error('Thumb not found');
    }
    await this.locator
      .page()
      .mouse.move(box.x + box.width / 2 + (delta.x || 0), box.y + box.height / 2 + (delta.y || 0));
    await this.locator.page().mouse.up();
  }

  public async pressKey(key: string, handle?: 'start' | 'end') {
    if (handle) {
      await (handle === 'start' ? this.thumbStart : this.thumbEnd).press(key);
      return;
    }
    await this.locator.press(key);
  }

  public override async focus(handle?: 'start' | 'end') {
    if (handle) {
      await (handle === 'start' ? this.thumbStart : this.thumbEnd).focus();
      return;
    }
    await this.locator.focus();
  }
}
