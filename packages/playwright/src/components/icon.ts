import { expect, type Locator } from '@playwright/test';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

export class JigIconHarness extends JigHarness {
  public readonly classes = themeClasses(iconControlTemplate);

  /** The inlined `<svg>` of an Iconify or default icon. */
  public readonly svg: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.svg = locator.locator('svg');
  }

  public expectViewBox(viewBox: string): Promise<void> {
    return expect(this.svg).toHaveAttribute('viewBox', viewBox);
  }

  /** Icons are decorative, so the svg must be hidden from assistive technology. */
  public async expectDecorative(): Promise<void> {
    await expect(this.svg).toHaveCount(1);
    await expect(this.svg).toHaveAttribute('aria-hidden', 'true');
  }
}
