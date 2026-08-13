import { type Locator, expect } from '@playwright/test';
import { themeClasses } from '../utils/theme.js';
import { accordionPanelControlTemplate } from '@awdlab/jig-themes/templates/accordion-panel';
import { JigHarness } from '../harness.js';

export class JigAccordionHarness extends JigHarness {
  public readonly classes = themeClasses(accordionPanelControlTemplate);

  public readonly panels: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.panels = this.locator.locator(this.classes['root']);
  }

  public getPanelByIndex(index: number): JigAccordionPanelHarness {
    return new JigAccordionPanelHarness(this.panels.nth(index));
  }

  public expectPanelCount(count: number) {
    return expect(this.panels).toHaveCount(count);
  }
}

export class JigAccordionPanelHarness extends JigHarness {
  public readonly classes = themeClasses(accordionPanelControlTemplate);

  public readonly header: Locator;
  public readonly content: Locator;

  constructor(locator: Locator) {
    super(locator);
    this.header = this.locator.locator(this.classes['header']);
    this.content = this.locator.locator(this.classes['content']);
  }

  public expectHeaderText(expected: string) {
    return expect(this.header).toHaveText(expected);
  }

  public expectExpanded(expanded = true) {
    return expect(this.header).toHaveAttribute('aria-expanded', String(expanded));
  }

  public override expectDisabled(disabled = true) {
    return expect(this.header).toBeDisabled();
  }

  public async toggle() {
    await this.header.click();
  }
}
