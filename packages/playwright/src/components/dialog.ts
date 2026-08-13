import { expect, type Locator } from '@playwright/test';
import { dialogControlTemplate } from '@awdlab/jig-themes/templates/dialog';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';

export class JigDialogHarness extends JigHarness {
  public readonly classes = themeClasses(dialogControlTemplate);

  /** The native `<dialog>` — what the top layer actually shows and sizes. */
  public readonly wrapper: Locator;
  public readonly header: Locator;
  public readonly title: Locator;
  public readonly content: Locator;
  public readonly footer: Locator;
  public readonly closeButton: Locator;
  public readonly footerButtons: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.wrapper = locator.locator('dialog');
    this.header = locator.locator(this.classes.header);
    this.title = locator.locator(this.classes['default-header']);
    this.content = locator.locator(this.classes.content);
    this.footer = locator.locator(this.classes.footer);
    this.closeButton = this.header.locator('button');
    this.footerButtons = locator.locator(`${this.classes['default-footer']} button`);
  }

  /**
   * Gates on the `<dialog>`'s own `open` property, not just visibility: the element paints a
   * frame before it is a dismissible top-layer node, and a keypress sent in between is lost.
   */
  public async expectOpened(opened = true): Promise<void> {
    await expect
      .poll(() => this.wrapper.evaluate(el => (el as HTMLDialogElement).open))
      .toBe(opened);
    await expect(this.wrapper).toBeVisible({ visible: opened });
  }

  public async expectModal(modal = true): Promise<void> {
    const asModal = this.wrapper.and(this.page.locator(this.classes.modal));
    await expect(asModal).toHaveCount(modal ? 1 : 0);
  }

  public async close(): Promise<void> {
    await this.closeButton.click();
    await this.expectOpened(false);
  }

  public async pressEscape(): Promise<void> {
    await this.expectOpened();
    await this.page.keyboard.press('Escape');
  }

  /** Click outside the dialog's box — the backdrop dismiss path. */
  public async clickBackdrop(): Promise<void> {
    const box = await this.wrapper.boundingBox();
    if (!box) throw new Error('dialog has no box');
    await this.page.mouse.click(Math.max(box.x - 20, 2), Math.max(box.y - 20, 2));
  }
}
