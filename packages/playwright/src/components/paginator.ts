import { expect, type Locator } from '@playwright/test';
import { paginatorControlTemplate } from '@awdlab/jig-themes/templates/paginator';
import { themeClasses } from '../utils/theme.js';
import { JigHarness } from '../harness.js';
import { JigItemViewHarness } from './item-view.js';
import { JigSelectHarness } from './select.js';

export class JigPaginatorHarness extends JigHarness {
  public readonly classes = themeClasses(paginatorControlTemplate);

  public readonly previous: Locator;
  public readonly next: Locator;
  /** Page buttons currently in the bar — the overflow ellipsis is not one of them. */
  public readonly pages: Locator;
  public readonly activePage: Locator;
  public readonly overflow: Locator;
  /** The `compact` mode page counter, which renders instead of the page buttons. */
  public readonly compactPage: Locator;
  public readonly itemView: JigItemViewHarness;
  public readonly pageSize: JigSelectHarness;

  constructor(locator: Locator) {
    super(locator);
    this.previous = locator.locator(this.classes.previous['root']);
    this.next = locator.locator(this.classes.next['root']);
    this.pages = locator.locator(this.classes['page-number']['root']);
    this.activePage = locator.locator(this.classes['active-page']);
    this.overflow = locator.locator(this.classes.overflow['root']);
    this.compactPage = locator.locator('[data-compact-page]');
    this.itemView = new JigItemViewHarness(locator.locator(this.classes['item-view']['root']));
    this.pageSize = new JigSelectHarness(
      locator.locator(`${this.classes['page-size-options']} jig-select`)
    );
  }

  /** The 1-based label of the current page, in either mode. */
  public expectCurrentPage(page: number): Promise<void> {
    return expect(this.locator.locator('[aria-current="page"]')).toHaveText(String(page));
  }

  public expectPageCount(count: number): Promise<void> {
    return expect(this.pages).toHaveCount(count);
  }

  public goToPage(page: number): Promise<void> {
    return this.pages.filter({ hasText: new RegExp(`^\\s*${page}\\s*$`) }).click();
  }

  public goToNext(): Promise<void> {
    return this.next.click();
  }

  public goToPrevious(): Promise<void> {
    return this.previous.click();
  }
}
