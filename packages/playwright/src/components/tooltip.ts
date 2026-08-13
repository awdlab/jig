import { tooltipControlTemplate } from '@awdlab/jig-themes/templates/tooltip';
import { themeClasses } from '../utils/theme.js';
import { expect, type Locator } from '@playwright/test';
import { JigHarness } from '../harness.js';

export class JigTooltipHarness extends JigHarness {
  public readonly classes = themeClasses(tooltipControlTemplate);

  private readonly _jigDefer: Locator;
  private readonly _contentWrapper: Locator;

  public readonly content: Locator;

  constructor(locator: Locator) {
    super(locator);
    this._jigDefer = locator.locator('jig-defer');
    this._contentWrapper = locator.locator(this.classes.content);
    this.content = this._jigDefer.locator('> *');
  }

  public async expectOpened(opened = true) {
    await expect(this._contentWrapper).toBeVisible({ visible: opened });
  }

  public async expectRendered(rendered = true): Promise<void> {
    await expect(this._jigDefer).toBeAttached();
    await expect(async () => {
      const el = await this._jigDefer.elementHandle();
      const hasContent =
        !!(await el?.innerText()) || !!(await el?.evaluate(e => e.childElementCount));
      if (rendered) {
        expect(hasContent).toBeTruthy();
      } else {
        expect(hasContent).toBeFalsy();
      }
    }).toPass({ timeout: 2000 });
  }
}
