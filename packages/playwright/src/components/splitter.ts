import { expect, type Locator } from '@playwright/test';
import { splitterControlTemplate } from '@awdlab/jig-themes/templates/splitter';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

export class JigSplitterHarness extends JigHarness {
  public readonly classes = themeClasses(splitterControlTemplate);

  public readonly panels: Locator;
  public readonly dividers: Locator;
  /** The focusable `role="separator"` handles — one per divider. */
  public readonly handles: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.panels = locator.locator('jig-splitter-panel');
    this.dividers = locator.locator(this.classes.divider);
    this.handles = locator.locator(this.classes['divider-handle']);
  }

  public expectPanelCount(count: number): Promise<void> {
    return expect(this.panels).toHaveCount(count);
  }

  /** The handle's `aria-valuenow` — the size of the panel before it, as a percentage. */
  public expectDividerValue(index: number, value: number): Promise<void> {
    return expect(this.handles.nth(index)).toHaveAttribute('aria-valuenow', String(value));
  }

  public async expectPanelSize(index: number, size: number, tolerance = 2): Promise<void> {
    const box = await this.panels.nth(index).boundingBox();
    if (!box) throw new Error(`panel ${index} has no box`);
    const actual = (await this.isVertical()) ? box.height : box.width;
    expect(Math.abs(actual - size)).toBeLessThanOrEqual(tolerance);
  }

  /** Drag a divider by `delta` pixels along the splitter's axis. */
  public async dragDivider(index: number, delta: number): Promise<void> {
    const handle = this.handles.nth(index);
    const box = await handle.boundingBox();
    if (!box) throw new Error(`divider ${index} has no box`);
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const vertical = await this.isVertical();
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.mouse.move(vertical ? x : x + delta, vertical ? y + delta : y, { steps: 5 });
    await this.page.mouse.up();
  }

  /** Move a divider with the keyboard — the accessible resize path. */
  public async pressDivider(index: number, key: string): Promise<void> {
    await this.handles.nth(index).focus();
    await this.handles.nth(index).press(key);
  }

  /** Derived from where the panels actually sit, not from `aria-orientation` (whose ARIA
   * convention is the inverse of the layout the splitter names). */
  private async isVertical(): Promise<boolean> {
    const first = await this.panels.nth(0).boundingBox();
    const second = await this.panels.nth(1).boundingBox();
    if (!first || !second) return false;
    return Math.abs(second.y - first.y) > Math.abs(second.x - first.x);
  }
}
