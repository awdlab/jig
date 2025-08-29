import { Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export class NgnAccordionHarness {
  public readonly classes = themeClasses(accordionControlTemplate);

  public readonly panels: Locator;

  constructor(public locator: Locator) {
    this.panels = this.locator.locator(this.classes['panel']);
  }

  public getPanelByIndex(index: number): NgnAccordionPanelHarness {
    return new NgnAccordionPanelHarness(this.panels.nth(index));
  }

  public expectPanelCount(count: number) {
    return expect(this.panels).toHaveCount(count);
  }
}

export class NgnAccordionPanelHarness {
  public readonly classes = themeClasses(accordionControlTemplate);

  public readonly header: Locator;
  public readonly content: Locator;

  constructor(public locator: Locator) {
    this.header = this.locator.locator(this.classes['panel-header']);
    this.content = this.locator.locator(this.classes['panel-content']);
  }

  public expectHeaderText(expected: string) {
    return expect(this.header).toHaveText(expected);
  }

  public expectExpanded(expanded = true) {
    return expect(this.header).toHaveAttribute('aria-expanded', String(expanded));
  }

  public expectDisabled(disabled = true) {
    return expect(this.header).toBeDisabled();
  }

  public async toggle() {
    await this.header.click();
  }
}
