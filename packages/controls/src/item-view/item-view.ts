import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  elementSizeSignal,
  elementsSizesSignal,
  NgnTemplate,
  Platform,
} from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { areArraysDeepEqual } from '@ngneers/controls/utils';
import { IconType } from '@ngneers/controls-custom-types';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

import {
  calculateItemViewLayout,
  getItemOverflowCheckOrder,
  type OverflowOrder,
} from './item-view-layout';
import { ItemViewTemplates } from './item-view-templates';
import { OverflowStrategy } from './types';

type RenderItem<T> =
  | {
      id: string | number;
      kind: 'visibleItem' | 'overflowItem';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-item-view',
  templateUrl: './item-view.html',
  imports: [NgClass, NgTemplateOutlet, NgnTemplate, NgnIcon],
  providers: [provideSelf(NgnItemView)],
  host: {
    '[class]': 'theme.class()',
    '[attr.role]': '"list"',
  },
})
export class NgnItemView<T extends object, IdField extends keyof T>
  extends ItemViewTemplates<T>
  implements AfterViewInit
{
  protected readonly theme = this.injectThemeTemplate(itemViewControlTemplate);
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

  private readonly _themeGap = signal(0);
  private readonly _isBrowser = inject(Platform).isBrowser;

  protected readonly separatorChar = computed(() => {
    const sep = this.separator();
    return typeof sep === 'boolean' ? (sep ? ', ' : '') : sep;
  });

  private readonly _renderedItemRefs = viewChildren<ElementRef<HTMLElement>>('itemRef');
  private readonly _renderedItemSizes = elementsSizesSignal(this._renderedItemRefs);
  private readonly _renderedItemWidths = computed(
    () => this._renderedItemSizes().map(size => size.width),
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
    // Add all items to the result, marking them as visible or overflowed
    const res: RenderItem<T>[] = this.items().map((item, index) => {
      if (renderedItemOrders.some(x => x.index === index)) {
        return <RenderItem<T>>{
          id: item[this.idField()] as string | number,
          kind: 'visibleItem',
          item,
        };
      } else {
        return <RenderItem<T>>{
          id: item[this.idField()] as string | number,
          kind: 'overflowItem',
          item,
        };
      }
    });

    const getTheoreticalFirstIndexForOverflowIndicator = () => {
      if (this.itemOverflowCheckOrder().length === 0) {
        return 0;
      }
      return this.itemOverflowCheckOrder()[this.itemOverflowCheckOrder().length - 1].index;
    };

    // Insert overflow indicators at the calculated indices
    let adjust = 0;
    layout.overflowIndicatorIndices.forEach(index => {
      const usedIndex = index ?? getTheoreticalFirstIndexForOverflowIndicator() + adjust;
      res.splice(usedIndex, 0, <RenderItem<T>>{
        id: `overflow-indicator-${index}`,
        kind: 'overflowIndicator',
        visible: index !== null,
        items: this.items().filter((_, i) => !renderedItemOrders.some(ro => ro.index === i)),
        hasSeparator: renderedItemOrders.some(x => x.index + adjust > usedIndex),
      });
      adjust++;
    });

    return res;
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
