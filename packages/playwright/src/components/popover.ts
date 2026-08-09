import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

export class NgnPopoverHarness {
  public readonly classes = themeClasses(popoverControlTemplate);

  private readonly _ngnLazyCacher: Locator;
  private readonly _contentWrapper: Locator;
  private readonly _content: Locator;

  constructor(locator: Locator) {
    this._ngnLazyCacher = locator.locator('awd-defer');
    this._contentWrapper = locator.locator(this.classes.content);
    this._content = this._ngnLazyCacher.locator('> *');
  }

  public get content(): Locator {
    return this._content;
  }

  public async expectOpened() {
    await expect(this._contentWrapper).toBeVisible();
  }

  public async expectRendered(rendered = true): Promise<void> {
    await expect(this._ngnLazyCacher).toBeAttached();
    await expect(async () => {
      const el = await this._ngnLazyCacher.elementHandle();
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
