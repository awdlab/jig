import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  untracked,
} from '@angular/core';
import { elementSizeSignal } from '@awdlab/jig/api/ng';
import { provideSelf } from '@awdlab/jig/base';
import { JigScrollAmount } from '@awdlab/jig/directives';
import { type AllKeysOfUnion, getScrollTop, JigError } from '@awdlab/jig/utils';
import { scrollerControlTemplate } from '@awdlab/jig-themes/templates/scroller';

import { ScrollerTemplates } from './scroller-templates';

/**
 * @category control
 */
@Component({
  selector: 'jig-scroller, [jig-scroller]',
  templateUrl: './scroller.html',
  imports: [NgTemplateOutlet],
  providers: [provideSelf(JigScroller)],
  hostDirectives: [
    { directive: JigScrollAmount, inputs: ['ngnScrollAmountContainer: scrollContainer'] },
  ],
  host: {
    // No attribute at all when not focusable: a tabindex (even -1) makes the element
    // focusable to axe, which then rejects it as a child of role="listbox"/"tree".
    '[attr.tabindex]': 'focusable() ? 0 : null',
    '[style.--jig-scroller-item-height.px]': 'itemHeight() ?? "auto"',
    '[style.--jig-scroller-padding-top.px]': 'paddingTop()',
    '[style.--jig-scroller-padding-bottom.px]': 'paddingBottom()',
  },
})
export class JigScroller<T> extends ScrollerTemplates<T> {
  protected readonly theme = this.injectThemeTemplate(scrollerControlTemplate, {
    root: true,
    virtual: () => !!this.virtual(),
  });
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _scrollAmount = inject(JigScrollAmount);

  /** Remaining vertical scroll distance to the bottom (px). Proxied from the host scroll directive. */
  public readonly distanceFromEnd = this._scrollAmount.distanceFromEnd;

  /**
   * The items to be displayed in the scroller.
   * This is a required input and should be an array of items of type {@link T}.
   */
  public readonly items = input.required<readonly T[]>();
  /**
   * The field of the item that uniquely identifies it.
   */
  public readonly fieldId = input<keyof T>();
  /**
   * Returns a stable identity for an item. Takes precedence over {@link fieldId}.
   * Without either, items track by index, so rendered rows are recycled across
   * different items and CSS transitions on their content replay.
   */
  public readonly trackBy = input<(item: T) => unknown>();
  /**
   * Whether the scroller should use virtual scrolling.
   * When set to true, the scroller will only render the items that are currently visible
   * on the screen, improving performance for large lists.
   *
   * When virtual scrolling is enabled, {@link itemHeight} must be set to a non-zero value.
   * @default `false`
   */
  public readonly virtual = input(false, { transform: booleanAttribute });
  /**
   * When {@link virtual} scrolling is enabled, this input is required to define the height of each item in pixels.
   */
  public readonly itemHeight = input<number | undefined>(undefined);
  /**
   * When {@link virtual} scrolling is enabled, this input defines the number of items to be rendered above and below the visible area.
   * This can help to reduce flickering when scrolling.
   * @default `2`
   */
  public readonly virtualPadding = input<number>(2);
  /**
   * Determines whether the scroller should have a tab index and be focusable.
   * @default `false`
   */
  public readonly focusable = input(false, { transform: booleanAttribute });
  /**
   * Determines whether an item is sticky or not.
   * If set, the scroller will stick the items with a truthy value for the specified field to the top of the scroller.
   */
  public readonly fieldSticky = input<AllKeysOfUnion<T> | null>(null);
  /**
   * Height in px of content pinned to the top of the scroll container (e.g. a
   * table's sticky header row). {@link scrollToIndex} keeps items clear of it.
   * @default 0
   */
  public readonly stickyOffset = input<number>(0);

  /**
   * Viewport size — tracks the scroll ancestor's dimensions so that virtual
   * scrolling works when an outer element handles overflow (e.g. table wrapper).
   */
  private readonly _viewportSize = elementSizeSignal(
    computed(() => this._scrollAmount.scrollTarget())
  );

  private readonly _itemHeightPx = computed(() => this.itemHeight() ?? 0);

  /**
   * Vertical offset between the scroll container's top and the scroller element.
   * Non-zero when a parent (e.g. table wrapper) owns the scroll and the scroller
   * is positioned below other content (e.g. a sticky header row).
   */
  private readonly _scrollOffset = computed(() => {
    const target = this._scrollAmount.scrollTarget();
    if (target === this._el.nativeElement) return 0;
    return this._el.nativeElement.offsetTop;
  });

  private readonly _visibleItemCount = computed(() => {
    if (!this.virtual() || this._itemHeightPx() === 0) {
      return 0;
    }
    return Math.ceil(
      this._viewportSize().height / this._itemHeightPx() + this.virtualPadding() * 2
    );
  });
  private readonly _scrollTop = computed(() => {
    const raw = this._scrollAmount.scrollTop();
    return Math.max(0, raw - this._scrollOffset());
  });
  /**
   * The index of the first item that is rendered in the (virtual) scroller.
   */
  public readonly itemStartIndex = computed(() => {
    if (!this.virtual() || this._itemHeightPx() === 0) {
      return 0;
    }
    return Math.max(0, Math.ceil(this._scrollTop() / this._itemHeightPx()) - this.virtualPadding());
  });
  private readonly _itemEndIndex = computed(() =>
    this.virtual()
      ? Math.min(this.items().length, this.itemStartIndex() + this._visibleItemCount())
      : 0
  );

  protected readonly paddingTop = computed(() => {
    if (!this.virtual()) {
      return 0;
    }
    return (this.itemStartIndex() - (this.latestStickyItem() ? 1 : 0)) * this._itemHeightPx();
  });

  protected readonly paddingBottom = computed(() => {
    if (!this.virtual()) {
      return 0;
    }
    return (this.items().length - this._itemEndIndex()) * this._itemHeightPx();
  });

  protected readonly visibleItems = computed(() => {
    if (!this.virtual()) {
      return this.items().map((item, index) => ({ item, index }));
    }
    return this.items()
      .slice(this.itemStartIndex(), this._itemEndIndex())
      .map((item, index) => {
        return {
          item,
          index: this.itemStartIndex() + index,
        };
      });
  });

  /**
   * Returns the last sticky item that is not rendered regularly in the list.
   * Required because sticky items might need to be rendered longer than they would.
   * Only applicable when virtual scrolling is enabled.
   */
  protected readonly latestStickyItem = computed(() => {
    if (!this.virtual()) {
      return null;
    }
    const stickyField = this.fieldSticky();
    if (!stickyField) {
      return null;
    }
    const unrenderedItemsAtTop = this.items()
      .slice(0, this.itemStartIndex())
      .map((item, index) => ({
        item,
        index,
      }));
    const stickyItems = unrenderedItemsAtTop.filter(item => item.item[stickyField]);
    return stickyItems[stickyItems.length - 1] ?? null;
  });

  constructor() {
    super();
    effect(() => {
      if (this.virtual() && !this.itemHeight()) {
        throw new JigError('scroller', 'itemHeight must be set when virtual is true');
      }
    });
  }

  /**
   * Scrolls the item with the given index into view.
   * @param index The index of the item to scroll to.
   */
  public scrollToIndex(index: number, position: ScrollLogicalPosition = 'nearest') {
    untracked(() => {
      const scrollEl = this._scrollAmount.scrollTarget();
      // How far down the scroll content the items start — either the scroller's own
      // position or the sticky content pinned over it.
      const offset = Math.max(this._scrollOffset(), this.stickyOffset());

      const getItemSize = () => {
        if (this.virtual()) {
          const itemHeight = this._itemHeightPx();
          const itemTop = index * itemHeight + offset;
          return { itemHeight, itemTop };
        } else {
          let itemElement = this._el.nativeElement.children[index] as HTMLElement | null;
          while (!itemElement?.clientHeight && itemElement?.children.length) {
            itemElement = itemElement?.children[0] as HTMLElement | null;
          }
          if (!itemElement) return null;
          // Measured against the scroll container rather than via offsetTop, which
          // is relative to whatever the offsetParent happens to be (a rowgroup may
          // be positioned or display:contents, dropping the leading offset).
          const rect = itemElement.getBoundingClientRect();
          const containerTop = scrollEl.getBoundingClientRect().top + scrollEl.clientTop;
          return { itemTop: rect.top - containerTop + scrollEl.scrollTop, itemHeight: rect.height };
        }
      };
      const size = getItemSize();
      if (!size) {
        return;
      }
      const { itemTop, itemHeight } = size;
      // Sticky content covers the top of the viewport, so align inside the band
      // below it — otherwise a top-aligned item ends up behind it.
      const sticky = this.stickyOffset();
      scrollEl.scrollTo({
        top: getScrollTop(
          itemTop - sticky,
          itemHeight,
          scrollEl.clientHeight - sticky,
          scrollEl.scrollTop,
          position
        ),
      });
    });
  }

  protected track(item: { item: T; index: number }): unknown {
    const trackBy = this.trackBy();
    if (trackBy) {
      return trackBy(item.item);
    }
    const fieldId = this.fieldId();
    if (fieldId) {
      return item.item[fieldId];
    }
    return item.index;
  }
}
