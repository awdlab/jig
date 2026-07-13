import { NgTemplateOutlet } from '@angular/common';
import {
  type AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  elementSizeSignal,
  elementsSizesSignal,
  NgnTemplate,
  Platform,
} from '@ngneers/controls/api/ng';
import { NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { areArraysDeepEqual, throwExp } from '@ngneers/controls/utils';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

import {
  calculateItemViewLayout,
  getItemOverflowCheckOrder,
  type ItemOverflowLocation,
  type OverflowOrder,
} from './item-view-layout';
import { ItemViewTemplates } from './item-view-templates';

import type { OverflowStrategy } from './types';
import type { IconType } from '@ngneers/controls-custom-types';

type RenderItem<T> =
  | {
      id: string | number;
      kind: 'visibleItem';
      item: T;
    }
  | {
      id: string | number;
      kind: 'overflowItem';
      location: ItemOverflowLocation;
      item: T;
    }
  | {
      id: string;
      kind: 'overflowIndicator';
      visible: boolean;
      items: T[];
      hasSeparator: boolean;
    };

/**
 * @category control
 */
@Component({
  selector: 'ngn-item-view',
  templateUrl: './item-view.html',
  imports: [NgnPt, NgTemplateOutlet, NgnTemplate, NgnIcon],
  providers: [provideSelf(NgnItemView)],
  host: {
    '[attr.role]': '"list"',
    '[style.--ngn-item-view-content-width]': 'contentWidthPx()',
  },
})
export class NgnItemView<T extends object, IdField extends keyof T>
  extends ItemViewTemplates<T>
  implements AfterViewInit
{
  protected readonly theme = this.injectThemeTemplate(itemViewControlTemplate, 'root');
  /**
   * The key of the id property in the item object. This is used to track items in the template.
   */
  public readonly idField = input.required<IdField>();
  /**
   * The items to be displayed in the item view.
   * This is a required input and should be an array of items of type {@link T}.
   */
  public readonly items = input.required<readonly T[]>();
  /**
   * A separator string (character) to be displayed between items. Set `true` for `,` or provide a custom string.
   */
  public readonly separator = input<true | string>();
  /**
   * A separator icon to be displayed between items.
   */
  public readonly iconItemSeparator = input<IconType>();
  /**
   * Strategy to use when there are more items than can be displayed in the available space.
   * The value determines where the items should start to overflow.
   * @default 'end'
   */
  public readonly overflowStrategy = input<OverflowStrategy>('end');
  /**
   * The amount of items to keep visible after or before overflowing, depending on the {@link overflowStrategy}.
   * @default 0
   */
  public readonly overflowStrategyFreezeCount = input<number>(0);
  /**
   * Index of the item to be used as the overflow indicator when using the 'aroundIndex' overflow strategy.
   * This input is only relevant when the {@link overflowStrategy} is set to 'aroundIndex'.
   * @default 0
   */
  public readonly overflowStrategyIndex = input<number>(0);
  /**
   * Set this to `true` for greatly improving performance when all items have the same width.
   * Especially true for large lists of items.
   *
   * Only the first item is measured and its width is assumed for all others, instead
   * of measuring every rendered item. The rendered structure is unchanged — overflowed
   * items are still emitted as `role="listitem"` and the overflow indicator still shows
   * the hidden count — so accessibility is unaffected. The tradeoff is correctness:
   * if items are *not* actually the same width, the visible/overflow split will be wrong.
   * @default false
   */
  public readonly sameWidthItems = input(false, { transform: booleanAttribute });

  private readonly _themeGap = signal(0);
  private readonly _isBrowser = inject(Platform).isBrowser;

  protected readonly separatorChar = computed(() => {
    const sep = this.separator();
    return typeof sep === 'boolean' ? (sep ? ', ' : '') : sep;
  });

  private readonly _enableSizeMeasuring = computed(() => !this.sameWidthItems());
  private readonly _renderedItemRefs = viewChildren<ElementRef<HTMLElement>>('itemRef');
  private readonly _firstItemRef = viewChild<ElementRef<HTMLElement>>('itemRef');
  private readonly _firstItemWidth = elementSizeSignal(this._firstItemRef);
  private readonly _renderedItemSizes = elementsSizesSignal(
    this._renderedItemRefs,
    this._enableSizeMeasuring
  );
  private readonly _renderedItemWidths = computed(
    () =>
      this.sameWidthItems()
        ? this.items().map(() => this._firstItemWidth().width || Number.MAX_SAFE_INTEGER)
        : this._renderedItemSizes().map(size => size.width),
    { equal: areArraysDeepEqual }
  );
  private readonly _containerSize = elementSizeSignal(this.element.nativeElement);
  private readonly _overflowItemRef = viewChild<ElementRef<HTMLElement>>('overflowItem');
  private readonly _overflowItemSize = elementSizeSignal(this._overflowItemRef);

  protected readonly itemOverflowCheckOrder = computed<OverflowOrder>(() => {
    const count = this.items().length;
    const freezeCount = Math.min(this.overflowStrategyFreezeCount(), count);
    return getItemOverflowCheckOrder({
      count,
      strategy: this.overflowStrategy(),
      freezeCount,
      strategyIndex: this.overflowStrategyIndex(),
    });
  });

  protected readonly renderedItems = computed<RenderItem<T>[]>(() => {
    const containerWidth = this._containerSize().width;
    const renderedItemWidths = this._renderedItemWidths();
    const overflowCheckOrder = this.itemOverflowCheckOrder();

    const count = this.items().length;
    const freezeCount = Math.min(this.overflowStrategyFreezeCount(), count);
    const layout = calculateItemViewLayout({
      count,
      strategy: this.overflowStrategy(),
      freezeCount,
      strategyIndex: this.overflowStrategyIndex(),
      containerWidth,
      itemWidths: renderedItemWidths,
      overflowItemWidth: this._overflowItemSize().width,
      gap: this._themeGap(),
    });

    const renderedItemOrders = layout.renderedItemOrders;
    // Precompute quick lookups for the hot paths below.
    // - `renderedIndexSet` allows O(1) visibility checks.
    // - `locationByIndex` avoids repeatedly scanning the overflow order to find an item's location.
    const renderedIndexSet = new Set<number>(renderedItemOrders.map(x => x.index));
    const locationByIndex: Array<ItemOverflowLocation | undefined> = Array.from({
      length: count,
    });
    for (const entry of overflowCheckOrder) {
      locationByIndex[entry.index] = entry.location;
    }

    // First pass: build the full list with items marked as visible vs overflowed.
    // We'll insert overflow indicators afterwards at the computed insertion indices.
    let res: RenderItem<T>[] = this.items().map((item, index) => {
      if (renderedIndexSet.has(index)) {
        return <RenderItem<T>>{
          id: item[this.idField()] as string | number,
          kind: 'visibleItem',
          item,
        };
      } else {
        return <RenderItem<T>>{
          id: item[this.idField()] as string | number,
          kind: 'overflowItem',
          location: locationByIndex[index] ?? 'end',
          item,
        };
      }
    });

    const getFallbackOverflowIndicatorIndex = () => {
      // When the layout says "no indicator" for the only slot (null), we still need a stable
      // insertion index so the DOM structure stays consistent for measurement.
      if (overflowCheckOrder.length === 0) {
        return 0;
      }
      const lastItem = overflowCheckOrder[overflowCheckOrder.length - 1];
      return (lastItem ?? throwExp('NgnItemView', 'Unexpected empty entry in overflowCheckOrder'))
        .index;
    };

    // Insert overflow indicators at the calculated indices
    // Note: inserting into `res` shifts subsequent indices; track that shift explicitly with `insertOffset`.
    let insertOffset = 0;

    // Collect overflowed items, both as a single list and grouped by location.
    const overflowedItemsAll: T[] = [];
    const overflowedItemsByLocation: Record<ItemOverflowLocation, T[]> = {
      start: [],
      end: [],
      center: [],
    };
    const allItems = this.items();
    for (let i = 0; i < count; i++) {
      if (renderedIndexSet.has(i)) {
        continue;
      }
      const item = allItems[i];
      if (item === undefined) {
        continue;
      }
      overflowedItemsAll.push(item);
      const location = locationByIndex[i] ?? 'end';
      overflowedItemsByLocation[location].push(item);
    }

    layout.overflowIndicatorIndices.forEach((indicatorIndex, iterationIndex) => {
      const insertIndex = indicatorIndex ?? getFallbackOverflowIndicatorIndex() + insertOffset;

      // If two overflow indicators are rendered (aroundIndex), we must split overflow items by location
      // so each indicator shows its own count/list.
      const overflowIndicatorLocation =
        layout.overflowIndicatorCount === 1 ? null : iterationIndex === 0 ? 'start' : 'end';
      const items = overflowIndicatorLocation
        ? overflowedItemsByLocation[overflowIndicatorLocation]
        : overflowedItemsAll;

      res.splice(insertIndex, 0, <RenderItem<T>>{
        id: `overflow-indicator-${indicatorIndex}`,
        kind: 'overflowIndicator',
        visible: indicatorIndex !== null,
        items,
        hasSeparator: renderedItemOrders.some(x => x.index + insertOffset > insertIndex),
      });
      insertOffset++;
    });

    // In fixed width mode, remove all hidden items except for the first one (used for measurement)
    if (this.sameWidthItems()) {
      res = res.filter((item, index) => item.kind !== 'overflowItem' || index === 0);
    }

    return res;
  });

  /** Full content width as `px`; `null` until measured (respects sameWidthItems optimization). */
  protected readonly contentWidthPx = computed<string | null>(() => {
    const allItemsWidth = Math.ceil(
      this._renderedItemWidths().reduce((sum, w) => sum + w, 0) +
        this._themeGap() * Math.max(0, this.items().length - 1)
    );
    return Number.isFinite(allItemsWidth) && allItemsWidth > 0 && allItemsWidth < 100_000
      ? `${allItemsWidth}px`
      : null;
  });

  public ngAfterViewInit(): void {
    if (!this._isBrowser) {
      return;
    }
    requestAnimationFrame(() => {
      const gapString = getComputedStyle(this.element.nativeElement).getPropertyValue('column-gap');
      const gap = parseFloat(gapString) || 0;
      this._themeGap.set(gap);
    });
  }
}
