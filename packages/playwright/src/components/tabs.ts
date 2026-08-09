import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { tabsControlTemplate } from '@awdlab/jig-themes/templates/tabs';

export class JigTabsHarness {
  public readonly classes = themeClasses(tabsControlTemplate);

  public readonly headers: Locator;
  public readonly contents: Locator;

  constructor(public locator: Locator) {
    this.headers = this.locator.locator(this.classes['header']);
    this.contents = this.locator.locator(this.classes['content']);
  }

  public getTabByIndex(index: number): JigTabHarness {
    return new JigTabHarness(this, index);
  }

  public expectTabCount(count: number) {
    return expect(this.headers).toHaveCount(count);
  }
}

export class JigTabHarness {
  public readonly classes = themeClasses(tabsControlTemplate);

  public readonly header: Locator;
  public readonly content: Locator;

  constructor(
    public tabs: JigTabsHarness,
    public index: number
  ) {
    this.header = this.tabs.headers.nth(index);
    this.content = this.tabs.contents.nth(index);
  }

  public expectHeaderText(expected: string) {
    return expect(this.header).toHaveText(expected);
  }

  public expectActive(active = true) {
    return expect(this.header).toHaveAttribute('aria-selected', String(active));
  }

  public async select() {
    await this.header.click();
  }
}
