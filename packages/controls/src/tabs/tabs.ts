import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  input,
  model,
  signal,
  viewChildren,
} from '@angular/core';
import { elementsSizesSignal, injectThemeTemplate } from '@ngneers/controls/api';
import { NgnBase } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { tabsControlTemplate } from '@ngneers/controls-themes/templates/tabs';

import { NgnTab } from './tab';
@Component({
  selector: 'ngn-tabs',
  imports: [NgTemplateOutlet, NgClass, NgnDefer],
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnTabs extends NgnBase {
  protected readonly theme = injectThemeTemplate(tabsControlTemplate);
  public readonly cache = input(false);
  public readonly lazy = input(false);

  protected readonly indicatorWidth = signal(100);
  protected readonly indicatorLeft = signal(0);

  private readonly _tabs = contentChildren(NgnTab);

  private readonly _renderedTabHeaders = viewChildren<ElementRef<HTMLButtonElement>>('tabHeader');
  private readonly _headerElements = computed(() =>
    this._renderedTabHeaders().map(header => header.nativeElement)
  );
  private readonly _headerSizes = elementsSizesSignal(this._headerElements);

  public readonly activeTab = model<string>('');

  protected readonly headers = computed(() =>
    this._tabs().map(tab => ({
      id: tab.tabId(),
      template: tab.header(),
    }))
  );

  protected readonly contents = computed(() =>
    this._tabs().map(tab => ({
      id: tab.tabId(),
      template: tab.content(),
    }))
  );

  public selectTab(tabId: string) {
    this.activeTab.set(tabId);
  }

  constructor() {
    super();

    effect(() => {
      const activeTabIndex = !this.activeTab()
        ? 0
        : this._tabs().findIndex(tab => tab.tabId() === this.activeTab());

      const headersizes = this._headerSizes(); // Figure out why this signal is not retriggering
      const headerSizesBeforeActive = headersizes
        .slice(0, activeTabIndex)
        .map(size => size.width)
        .reduce((partialSum, a) => partialSum + a, 0);

      this.indicatorWidth.set(headersizes[activeTabIndex]?.width ?? 0);
      this.indicatorLeft.set(headerSizesBeforeActive);
    });
  }
}
