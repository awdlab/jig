import { Locator, expect } from '@playwright/test';

export class NgnPopoverHarness {
  private readonly _ngnLazyCacher: Locator;
  private readonly _contentWrapper: Locator;
  private readonly _content: Locator;

  constructor(locator: Locator) {
    this._ngnLazyCacher = locator.locator('ngn-lazy-cacher');
    this._contentWrapper = locator.locator('.ngn-popover-content');
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
