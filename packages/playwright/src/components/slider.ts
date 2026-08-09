import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';
import { themeClasses } from '../utils/theme';
import test, { expect, type Locator } from '@playwright/test';

export class NgnSliderHarness {
  public readonly classes = themeClasses(sliderControlTemplate);

  public readonly locator: Locator;
  public readonly track: Locator;
  public readonly thumb: Locator;
  public readonly fill: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this.track = locator.locator(this.classes.track);
    this.thumb = locator.locator(this.classes.thumb);
    this.fill = locator.locator(this.classes.fill);
  }

  public async expectValue(value: number) {
    await expect(this.locator).toHaveAttribute('aria-valuenow', value.toString());
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

  public async expectReadonly(readonly: boolean) {
    if (readonly) {
      await expect(this.locator).toHaveAttribute('aria-readonly', 'true');
      await expect(this.locator).toHaveAttribute('tabindex', '0');
    } else {
      await expect(this.locator).not.toHaveAttribute('aria-readonly');
    }
  }

  public async expectDisabled(disabled: boolean) {
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

  public async dragThumb(delta: { x?: number; y?: number }) {
    await this.thumb.hover();
    await this.locator.page().mouse.down();
    const box = await this.thumb.boundingBox();
    if (!box) {
      throw new Error('Thumb not found');
    }
    await this.locator
      .page()
      .mouse.move(box.x + box.width / 2 + (delta.x || 0), box.y + box.height / 2 + (delta.y || 0));
    await this.locator.page().mouse.up();
  }

  public async pressKey(key: string) {
    await this.locator.press(key);
  }

  public async focus() {
    await this.locator.focus();
  }
}
