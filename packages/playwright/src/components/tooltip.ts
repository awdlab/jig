import { tooltipControlTemplate } from '@ngneers/controls-themes/templates/tooltip';
import { themeClasses } from '../utils/theme';
import { expect, type Locator } from '@playwright/test';

export class NgnTooltipHarness {
  public readonly classes = themeClasses(tooltipControlTemplate);

  private readonly _ngnDefer: Locator;
  private readonly _contentWrapper: Locator;

  public readonly locator: Locator;
  public readonly content: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
    this._ngnDefer = locator.locator('ngn-defer');
    this._contentWrapper = locator.locator(this.classes.content);
    this.content = this._ngnDefer.locator('> *');
  }

  public async expectOpened(opened = true) {
    await expect(this._contentWrapper).toBeVisible({ visible: opened });
  }

  public async expectRendered(rendered = true): Promise<void> {
    await expect(this._ngnDefer).toBeAttached();
    await expect(async () => {
      const el = await this._ngnDefer.elementHandle();
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
