import { colorPickerControlTemplate } from '@awdlab/jig-themes/templates/color-picker';
import { themeClasses } from '../utils/theme';
import { NGN_CLASSES } from '../utils/classes';
import { AwdInputHarness } from './input';
import { expect, type Locator } from '@playwright/test';

function clampEdge(ratio: number): number {
  return Math.min(0.98, Math.max(0.02, ratio));
}

export class AwdColorPickerHarness {
  public readonly classes = themeClasses(colorPickerControlTemplate);
  public readonly locator: Locator;
  public readonly trigger: Locator;
  // The popover panel is a native-popover child of the host (not portaled elsewhere in the
  // DOM), so it stays reachable via a plain descendant locator — same as `select`'s dropdown.
  public readonly panel: Locator;
  public readonly svArea: Locator;
  public readonly hueTrack: Locator;
  public readonly swatches: Locator;
  public readonly formatToggle: Locator;
  public readonly hexInput: AwdInputHarness;

  constructor(locator: Locator) {
    this.locator = locator;
    this.trigger = locator.locator(this.classes.trigger);
    this.panel = locator.locator(this.classes.panel);
    this.svArea = locator.locator(this.classes['sv-area']);
    this.hueTrack = locator.locator(this.classes['hue-track']);
    this.swatches = locator.locator(this.classes.swatch);
    this.formatToggle = locator.locator(this.classes['format-toggle']);
    this.hexInput = new AwdInputHarness(
      locator.locator(this.classes['fields']).locator(NGN_CLASSES.input['root'])
    );
  }

  public async open() {
    await this.trigger.click();
    await expect(this.panel).toBeVisible();
  }

  public async clickSv(xRatio: number, yRatio: number) {
    const box = await this.svArea.boundingBox();
    if (!box) throw new Error('sv-area not found');
    // ponytail: clamp away from the exact 0/1 edge — sub-pixel hit-test rounding can land the
    // click just outside the element (on the parent panel) at the literal boundary pixel.
    const x = box.width * clampEdge(xRatio);
    const y = box.height * clampEdge(yRatio);
    await this.svArea.click({ position: { x, y } });
  }

  public async clickHue(xRatio: number) {
    const box = await this.hueTrack.boundingBox();
    if (!box) throw new Error('hue-track not found');
    await this.hueTrack.click({
      position: { x: box.width * clampEdge(xRatio), y: box.height / 2 },
    });
  }
}
