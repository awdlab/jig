import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  type AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  elementSizeSignal,
  elementsSizesSignal,
  inlineArrowStep,
  isRtl,
  Platform,
} from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigDefer } from '@awdlab/jig/defer';
import { JigDragScroll, JigScrollAmount } from '@awdlab/jig/directives';
import { JigIcon } from '@awdlab/jig/icon';
import { JigError } from '@awdlab/jig/utils';
import { generateElementId } from '@awdlab/jig/utils-ng';
import { tabsControlTemplate } from '@awdlab/jig-themes/templates/tabs';

import { JigTab } from './tab';
import { TabsTemplates } from './tabs-templates';

import type { IconType } from '@awdlab/jig-custom-types';

const PADDING_FOR_STICKY_ELEMENTS = 15;

/**
 * @category control
 */
@Component({
  selector: 'jig-tabs',
  imports: [NgTemplateOutlet, JigPt, JigDefer, JigScrollAmount, JigDragScroll, JigIcon],
  templateUrl: './tabs.html',

  providers: [provideSelf(JigTabs)],
})
export class JigTabs extends TabsTemplates implements AfterViewInit {
  protected readonly theme = this.injectThemeTemplate(tabsControlTemplate, 'root');
  /**
   * Whether to lazy load the tab contents when they become visible.
   * @default false
   */
  public readonly lazy = input(false, { transform: booleanAttribute });
  /**
   * Whether to cache the tab contents. Only applies to {@link lazy} loaded tabs.
   * @default false
   */
  public readonly cache = input(false, { transform: booleanAttribute });
  /**
   * Get or set the active tab ID.
   */
  public readonly activeTab = model<string>('');
  /**
   * Icon for the scroll button at the inline-start edge.
   */
  public readonly iconScrollStart = input<IconType>();
  /**
   * Icon for the scroll button at the inline-end edge.
   */
  public readonly iconScrollEnd = input<IconType>();

  protected readonly isFirstRender = signal(true);

  protected readonly elementId = generateElementId();
  protected readonly indicatorWidth = signal(0);
  protected readonly indicatorInlineStart = signal(0);

  private readonly _tabs = contentChildren(JigTab);
  private readonly _tabList = viewChild.required<unknown, ElementRef<HTMLDivElement>>('tabList', {
    read: ElementRef<HTMLDivElement>,
  });
  private readonly _tabListScrollDirective = viewChild.required('tabList', {
    read: JigScrollAmount,
  });
  private readonly _tabListScroll = computed(() =>
    this._tabListScrollDirective().scrollInlineStart()
  );
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

  /**
   * Inter-header gap (theme-defined — e.g. shade renders the header row as a padded tray with a
   * `gap` between pills). Read from the resolved column-gap and re-evaluated whenever the list
   * resizes or its header set changes (covers theme swaps). Included in the width math below so
   * overflow detection isn't thrown off by the spacing between headers.
   */
  private readonly _platform = inject(Platform);
  private readonly _headerGap = computed(() => {
    // getComputedStyle is browser-only; on the server there is no layout, so the gap is irrelevant.
    if (!this._platform.isBrowser) {
      return 0;
    }
    this._tabListSize();
    this._headerSizes();
    const gap = parseFloat(getComputedStyle(this._tabList().nativeElement).columnGap);
    return Number.isFinite(gap) ? gap : 0;
  });

  private readonly _totalTabsWidth = computed(() => {
    const sizes = this._headerSizes();
    const totalWidth = sizes.reduce((sum, size) => sum + size.width, 0);
    // Gaps sit between headers: N headers → N-1 gaps. Without this the summed header widths
    // under-report the real scroll width and the right arrow hides while content still overflows.
    return totalWidth + this._headerGap() * Math.max(0, sizes.length - 1);
  });

  protected readonly tabsOverflowingEnd = computed(() => {
    const tabListWidth = this._tabListSize().width;
    const scrollAmount = this._tabListScroll();
    // Use the signal-tracked total width instead of reading scrollWidth
    // directly, which would force a synchronous layout.
    const totalHeadersWidth = this._totalTabsWidth();

    return totalHeadersWidth - scrollAmount > tabListWidth + 0.5;
  });

  protected readonly tabsOverflowingStart = computed(() => this._tabListScroll() > 0);

  constructor() {
    super();

    afterRenderEffect(() => {
      if (!this.activeTab() || !this._tabs().find(tab => tab.safeTabId() === this.activeTab())) {
        this.activeTab.set(this._tabs()[0]?.tabId() ?? '');
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
      this.indicatorInlineStart.set(headerSizesBeforeActive);
    });
  }

  public ngAfterViewInit() {
    if (!this.activeTab()) {
      this.activeTab.set(this._tabs()[0]?.tabId() ?? '');
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

      // Headers run along the inline axis, so RTL reverses which key advances.
      const nextIndex =
        indexOfCurrentTab + inlineArrowStep(event.currentTarget as Element, event.key);
      // overflow
      const safeNextIndex = (nextIndex + this._tabs().length) % this._tabs().length;

      this.ensureTabHeaderIsScrolledIntoView(safeNextIndex);

      const tabElement = document.getElementById(
        `${this.elementId}_tab_${this._tabs()[safeNextIndex]?.safeTabId()}`
      ) as HTMLElement;
      if (tabElement) {
        tabElement.focus();
      }
    }
  }

  private ensureTabHeaderIsScrolledIntoView(index: number) {
    const { start: startCutOffIndex, end: endCutOffIndex } = this.getCutOffTabHeaders();
    const tablistElement = this._tabList().nativeElement;
    if (index <= startCutOffIndex) {
      const newScrollLeft = this.calculateHeaderSliceWidth(0, index) - PADDING_FOR_STICKY_ELEMENTS;
      setTimeout(() => {
        this.scrollToInlineStart(tablistElement, newScrollLeft);
      });
    } else if (index >= endCutOffIndex && endCutOffIndex >= 0) {
      const rightCutOffHeader = this._headerSizes()[endCutOffIndex];
      if (!rightCutOffHeader) {
        throw new JigError(
          'JigTabs',
          `Right cut off header is undefined for index ${endCutOffIndex}`
        );
      }
      const newScrollLeft =
        this.calculateHeaderSliceWidth(0, index) -
        this._tabListSize().width +
        rightCutOffHeader.width +
        PADDING_FOR_STICKY_ELEMENTS;
      setTimeout(() => {
        this.scrollToInlineStart(tablistElement, newScrollLeft);
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
    let startCutOffIndex = -1;
    let endCutOffIndex = -1;
    let cumulativeWidth = PADDING_FOR_STICKY_ELEMENTS; // account for left padding

    headers.forEach(header => {
      for (let i = 0; i < headers.length; i++) {
        const headerStart = cumulativeWidth;
        const headerEnd = cumulativeWidth + header;
        cumulativeWidth = headerEnd;

        if (startCutOffIndex === -1 && headerEnd > scrollAmount) {
          startCutOffIndex = i;
        }
        if (
          endCutOffIndex === -1 &&
          headerStart < scrollAmount + tabListWidth &&
          headerEnd > scrollAmount + tabListWidth
        ) {
          endCutOffIndex = i;
        }
      }
    });
    return {
      start: startCutOffIndex,
      end: endCutOffIndex,
    };
  }

  /**
   * Scrolls the header list to `inlineStart` px from its inline-start edge.
   * `scrollTo` takes a physical offset, which runs negative under RTL.
   */
  private scrollToInlineStart(el: HTMLElement, inlineStart: number): void {
    el.scrollTo({ left: isRtl(el) ? -inlineStart : inlineStart, behavior: 'smooth' });
  }

  protected scrollHeaders(direction: 'start' | 'end') {
    const tabListElement = this._tabList().nativeElement;
    const headers = this._headerSizes().map(s => s.width);

    const tabListWidth = tabListElement.clientWidth - PADDING_FOR_STICKY_ELEMENTS; // account for right padding

    const { start: startCutOffIndex, end: endCutOffIndex } = this.getCutOffTabHeaders();

    if (direction === 'end') {
      const newScrollAmount = this.calculateHeaderSliceWidth(0, endCutOffIndex);

      const scrollAmountFixed =
        newScrollAmount >= tabListElement.scrollWidth
          ? newScrollAmount
          : newScrollAmount - PADDING_FOR_STICKY_ELEMENTS;
      this.scrollToInlineStart(tabListElement, scrollAmountFixed);
    } else {
      let usedUpSpace = 0;
      let indexOfFirstVisibleTab = startCutOffIndex;
      while (
        usedUpSpace < tabListWidth - PADDING_FOR_STICKY_ELEMENTS * 2 &&
        indexOfFirstVisibleTab >= 0
      ) {
        usedUpSpace += headers[indexOfFirstVisibleTab] ?? 0;
        indexOfFirstVisibleTab--;
      }

      const scrollTo =
        indexOfFirstVisibleTab < 0
          ? 0
          : headers.slice(0, indexOfFirstVisibleTab + 2).reduce((a, b) => a + b, 0) -
            PADDING_FOR_STICKY_ELEMENTS;

      this.scrollToInlineStart(tabListElement, scrollTo);
    }
  }
}
