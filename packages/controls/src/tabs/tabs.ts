import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  input,
  model,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { elementSizeSignal, elementsSizesSignal } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnDefer } from '@ngneers/controls/defer';
import { NgnDragScroll, NgnScrollAmount } from '@ngneers/controls/directives';
import { NgnIcon } from '@ngneers/controls/icon';
import { generateElementId } from '@ngneers/controls/utils-ng';
import { IconType } from '@ngneers/controls-custom-types';
import { tabsControlTemplate } from '@ngneers/controls-themes/templates/tabs';

import { NgnTab } from './tab';
import { TabsTemplates } from './tabs-templates';

const PADDING_FOR_STICKY_ELEMENTS = 15;

/**
 * @category control
 */
@Component({
  selector: 'ngn-tabs',
  imports: [NgTemplateOutlet, NgClass, NgnDefer, NgnScrollAmount, NgnDragScroll, NgnIcon],
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideSelf(NgnTabs)],
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnTabs extends TabsTemplates implements AfterViewInit {
  protected readonly theme = this.injectThemeTemplate(tabsControlTemplate);
  /**
   * Whether to lazy load the tab contents when they become visible.
   */
  public readonly lazy = input(false);
  /**
   * Whether to cache the tab contents. Only applies to {@link lazy} loaded tabs.
   */
  public readonly cache = input(false);
  /**
   * Get or set the active tab ID.
   */
  public readonly activeTab = model<string>('');
  /**
   * Icon for the left scroll button.
   */
  public readonly iconScrollLeft = input<IconType>();
  /**
   * Icon for the right scroll button.
   */
  public readonly iconScrollRight = input<IconType>();

  protected readonly isFirstRender = signal(true);

  protected readonly elementId = generateElementId();
  protected readonly indicatorWidth = signal(0);
  protected readonly indicatorLeft = signal(0);

  private readonly _tabs = contentChildren(NgnTab);
  private readonly _tabList = viewChild.required<unknown, ElementRef<HTMLDivElement>>('tabList', {
    read: ElementRef<HTMLDivElement>,
  });
  private readonly _tabListScrollDirective = viewChild.required('tabList', {
    read: NgnScrollAmount,
  });
  private readonly _tabListScroll = computed(() => this._tabListScrollDirective().scrollLeft());
  private readonly _tabListSize = elementSizeSignal(this._tabList);

  private readonly _renderedTabHeaders = viewChildren<ElementRef<HTMLButtonElement>>('tabHeader');
  private readonly _headerElements = computed(() =>
    this._renderedTabHeaders().map(header => header.nativeElement)
  );
  private readonly _headerSizes = elementsSizesSignal(this._headerElements);

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

  private readonly _totalTabsWidth = computed(() => {
    return this._headerSizes().reduce((sum, size) => sum + size.width, 0);
  });

  protected readonly tabsOverflowingRight = computed(() => {
    const tabListWidth = this._tabListSize().width;
    const tabListScrollWidth = this._tabList().nativeElement.scrollWidth - 0.5; // to avoid rounding issues
    const scrollAmount = this._tabListScroll();
    const _totalHeadersWidth = this._totalTabsWidth(); // retrigger calculation

    return tabListScrollWidth - scrollAmount > tabListWidth;
  });

  protected readonly tabsOverflowingLeft = computed(() => this._tabListScroll() > 0);

  constructor() {
    super();

    afterRenderEffect(() => {
      if (!this.activeTab() || !this._tabs().find(tab => tab.safeTabId() === this.activeTab())) {
        this.activeTab.set(this._tabs()[0]?.tabId());
      }
    });

    effect(() => {
      const activeTabIndex = this._tabs().findIndex(tab => tab.safeTabId() === this.activeTab());

      const headersizes = this._headerSizes();
      const headerSizesBeforeActive = headersizes
        .slice(0, activeTabIndex)
        .map(size => size.width)
        .reduce((partialSum, a) => partialSum + a, 0);

      this.indicatorWidth.set(headersizes[activeTabIndex]?.width ?? 0);
      this.indicatorLeft.set(headerSizesBeforeActive);
    });
  }

  public ngAfterViewInit() {
    if (!this.activeTab()) {
      this.activeTab.set(this._tabs()[0]?.tabId());
    }
    setTimeout(() => {
      this.isFirstRender.set(false);
    });
  }

  protected selectTab(tabId: string) {
    this.activeTab.set(tabId);
    this.ensureTabHeaderIsScrolledIntoView(
      this._tabs().findIndex(tab => tab.safeTabId() === tabId)
    );
  }

  protected handleTabKeyPress(event: KeyboardEvent, tabId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectTab(tabId);
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();

      const focussedTabElement = this._headerElements().findIndex(
        element => element === document.activeElement
      );

      const indexOfCurrentTab =
        focussedTabElement !== -1
          ? focussedTabElement
          : this._tabs().findIndex(tab => tab.safeTabId() === tabId);
      if (indexOfCurrentTab === -1) {
        return;
      }

      const nextIndex = event.key === 'ArrowRight' ? indexOfCurrentTab + 1 : indexOfCurrentTab - 1;
      // overflow
      const safeNextIndex = (nextIndex + this._tabs().length) % this._tabs().length;

      this.ensureTabHeaderIsScrolledIntoView(safeNextIndex);

      const tabElement = document.getElementById(
        `${this.elementId}_tab_${this._tabs()[safeNextIndex].safeTabId()}`
      ) as HTMLElement;
      if (tabElement) {
        tabElement.focus();
      }
    }
  }

  private ensureTabHeaderIsScrolledIntoView(index: number) {
    const { left: leftCutOffTabHeaderIndex, right: rightCutOffTabHeaderIndex } =
      this.getCutOffTabHeaders();
    const tablistElement = this._tabList().nativeElement;
    if (index <= leftCutOffTabHeaderIndex) {
      const newScrollLeft = this.calculateHeaderSliceWidth(0, index) - PADDING_FOR_STICKY_ELEMENTS;
      setTimeout(() => {
        tablistElement.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      });
    } else if (index >= rightCutOffTabHeaderIndex && rightCutOffTabHeaderIndex >= 0) {
      const newScrollLeft =
        this.calculateHeaderSliceWidth(0, index) -
        this._tabListSize().width +
        this._headerSizes()[rightCutOffTabHeaderIndex].width +
        PADDING_FOR_STICKY_ELEMENTS;
      setTimeout(() => {
        tablistElement.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      });
    }
  }

  private calculateHeaderSliceWidth(fromIndex: number, toIndex: number) {
    const headers = this._headerSizes().map(s => s.width);
    return headers.slice(fromIndex, toIndex).reduce((a, b) => a + b, 0);
  }

  private getCutOffTabHeaders() {
    const headers = this._headerSizes().map(s => s.width);
    const tabListElement = this._tabList().nativeElement;

    const tabListWidth = tabListElement.clientWidth - PADDING_FOR_STICKY_ELEMENTS; // account for right padding

    const scrollAmount = this._tabListScroll();
    let leftCutOffTabHeaderIndex = -1;
    let rightCutOffTabHeaderIndex = -1;
    let cumulativeWidth = PADDING_FOR_STICKY_ELEMENTS; // account for left padding

    for (let i = 0; i < headers.length; i++) {
      const headerStart = cumulativeWidth;
      const headerEnd = cumulativeWidth + headers[i];
      cumulativeWidth = headerEnd;

      if (leftCutOffTabHeaderIndex === -1 && headerEnd > scrollAmount) {
        leftCutOffTabHeaderIndex = i;
      }
      if (
        rightCutOffTabHeaderIndex === -1 &&
        headerStart < scrollAmount + tabListWidth &&
        headerEnd > scrollAmount + tabListWidth
      ) {
        rightCutOffTabHeaderIndex = i;
      }
    }
    return {
      left: leftCutOffTabHeaderIndex,
      right: rightCutOffTabHeaderIndex,
    };
  }

  protected scrollHeaders(direction: 'left' | 'right') {
    const tabListElement = this._tabList().nativeElement;
    const headers = this._headerSizes().map(s => s.width);

    const tabListWidth = tabListElement.clientWidth - PADDING_FOR_STICKY_ELEMENTS; // account for right padding

    const { left: leftCutOffTabHeaderIndex, right: rightCutOffTabHeaderIndex } =
      this.getCutOffTabHeaders();

    if (direction === 'right') {
      const newScrollAmount = this.calculateHeaderSliceWidth(0, rightCutOffTabHeaderIndex);

      const scrollAmountFixed =
        newScrollAmount >= tabListElement.scrollWidth
          ? newScrollAmount
          : newScrollAmount - PADDING_FOR_STICKY_ELEMENTS;
      tabListElement.scrollTo({ left: scrollAmountFixed, behavior: 'smooth' });
    } else {
      let usedUpSpace = 0;
      let indexOfFirstVisibleTab = leftCutOffTabHeaderIndex;
      while (
        usedUpSpace < tabListWidth - PADDING_FOR_STICKY_ELEMENTS * 2 &&
        indexOfFirstVisibleTab >= 0
      ) {
        usedUpSpace += headers[indexOfFirstVisibleTab];
        indexOfFirstVisibleTab--;
      }

      const scrollTo =
        indexOfFirstVisibleTab < 0
          ? 0
          : headers.slice(0, indexOfFirstVisibleTab + 2).reduce((a, b) => a + b, 0) -
            PADDING_FOR_STICKY_ELEMENTS;

      tabListElement.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }
}
