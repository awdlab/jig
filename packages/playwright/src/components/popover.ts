import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';
import { JigHarness } from '../harness.js';

export class JigPopoverHarness extends JigHarness {
  public readonly classes = themeClasses(popoverControlTemplate);

  private readonly _jigLazyCacher: Locator;
  private readonly _contentWrapper: Locator;
  private readonly _content: Locator;

  constructor(locator: Locator) {
    super(locator);
    this._jigLazyCacher = locator.locator('jig-defer');
    this._contentWrapper = locator.locator(this.classes.content);
    this._content = this._jigLazyCacher.locator('> *');
  }

  public get content(): Locator {
    return this._content;
  }

  public async expectOpened() {
    await expect(this._contentWrapper).toBeVisible();
  }

  public async expectRendered(rendered = true): Promise<void> {
    await expect(this._jigLazyCacher).toBeAttached();
    await expect(async () => {
      const el = await this._jigLazyCacher.elementHandle();
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
