import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { elementSizeSignal } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnScrollAmount } from '@ngneers/controls/directives';
import { AllKeysOfUnion, getScrollTop, NgnError } from '@ngneers/controls/utils';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';

import { ScrollerTemplates } from './scroller-templates';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-scroller, [ngn-scroller]',
  templateUrl: './scroller.html',
  imports: [NgClass, NgTemplateOutlet],
  providers: [provideSelf(NgnScroller)],
  hostDirectives: [{ directive: NgnScrollAmount }],
  host: {
    '[class]': 'theme.classes({ "": true, virtual: virtual() })',
    '[tabIndex]': 'focusable() ? 0 : -1',
    '[style.--ngn-scroller-item-height.px]': 'itemHeight()',
  },
})
export class NgnScroller<T> extends ScrollerTemplates<T> {
  protected readonly theme = this.injectThemeTemplate(scrollerControlTemplate);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _scrollAmount = inject(NgnScrollAmount);

  /**
   * The items to be displayed in the scroller.
   * This is a required input and should be an array of items of type {@link T}.
   */
  public readonly items = input.required<readonly T[]>();
  /**
   * Whether the scroller should use virtual scrolling.
   * When set to true, the scroller will only render the items that are currently visible
   * on the screen, improving performance for large lists.
   *
   * When virtual scrolling is enabled, {@link itemHeight} must be set to a non-zero value.
   * @default `false`
   */
  public readonly virtual = input<boolean | undefined>(false);
  /**
   * When {@link virtual} scrolling is enabled, this input is required to define the height of each item in pixels.
   */
  public readonly itemHeight = input<number>(0);
  /**
   * When {@link virtual} scrolling is enabled, this input defines the number of items to be rendered above and below the visible area.
   * This can help to reduce flickering when scrolling.
   * @default `2`
   */
  public readonly padding = input<number>(2);
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
   * Determines whether the scroller is loading items.
   * @default `false`
   */
  public readonly loading = input(false, { transform: booleanAttribute });

  private readonly _elementSize = elementSizeSignal(this._el);

  private readonly _visibleItemCount = computed(() =>
    this.virtual()
      ? Math.ceil(this._elementSize().height / this.itemHeight() + this.padding() * 2)
      : 0
  );
  private readonly _scrollTop = computed(() => this._scrollAmount.scrollTop());
  /**
   * The index of the first item that is rendered in the (virtual) scroller.
   */
  public readonly itemStartIndex = computed(() =>
    this.virtual()
      ? Math.max(0, Math.ceil(this._scrollTop() / this.itemHeight()) - this.padding())
      : 0
  );
  private readonly _itemEndIndex = computed(() =>
    this.virtual()
      ? Math.min(this.items().length, this.itemStartIndex() + this._visibleItemCount())
      : 0
  );

  protected readonly paddingTop = computed(() => {
    if (!this.virtual()) {
      return 0;
    }
    return (this.itemStartIndex() - (this.latestStickyItem() ? 1 : 0)) * this.itemHeight();
  });

  protected readonly paddingBottom = computed(() => {
    if (!this.virtual()) {
      return 0;
    }
    return (this.items().length - this._itemEndIndex()) * this.itemHeight();
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
        throw new NgnError('scroller', 'itemHeight must be set when virtual is true');
      }
    });
  }

  /**
   * Scrolls the item with the given index into view.
   * @param index The index of the item to scroll to.
   */
  public scrollToIndex(index: number, position: ScrollLogicalPosition = 'nearest') {
    untracked(() => {
      const getItemSize = () => {
        if (this.virtual()) {
          const itemHeight = this.itemHeight();
          const itemTop = index * itemHeight;
          return { itemHeight, itemTop };
        } else {
          // index +1 because of the padding/spacer element at the top
          const itemElement = this._el.nativeElement.children[index + 1] as HTMLElement | null;
          if (itemElement) {
            const itemTop = itemElement.offsetTop;
            const itemHeight = itemElement.clientHeight;
            return { itemTop, itemHeight };
          }
          return null;
        }
      };
      const size = getItemSize();
      if (!size) {
        return;
      }
      const { itemTop, itemHeight } = size;
      this._el.nativeElement.scrollTo({
        top: getScrollTop(
          itemTop,
          itemHeight,
          this._el.nativeElement.clientHeight,
          this._el.nativeElement.scrollTop,
          position
        ),
      });
    });
  }
}
