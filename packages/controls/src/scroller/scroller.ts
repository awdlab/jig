import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { elementSizeSignal } from '@ngneers/controls/api';
import { AllKeysOfUnion, NgnError } from '@ngneers/controls/utils';
import { fromEvent, map } from 'rxjs';

import { ScrollerTemplates } from './scroller-templates';

@Component({
  selector: 'ngn-scroller',
  templateUrl: './scroller.html',
  imports: [NgTemplateOutlet],
  host: {
    style: 'display: block; height: 100%; width: 100%;',
    '[tabIndex]': 'focusable() ? 0 : -1',
  },
})
export class Scroller<T> extends ScrollerTemplates<T> {
  /**
   * The items to be displayed in the scroller.
   * This is a required input and should be an array of items of type T.
   */
  public readonly items = input.required<readonly T[]>();
  /**
   * Whether the scroller should use virtual scrolling.
   * When set to true, the scroller will only render the items that are currently visible
   * on the screen, improving performance for large lists.
   *
   * When virtual scrolling is enabled, {@link itemHeight} must be set to a non-zero value.
   * @defaultValue `false`
   */
  public readonly virtual = input<boolean | undefined>(false);
  /**
   * When {@link virtual} scrolling is enabled, this input is required to define the height of each item in pixels.
   */
  public readonly itemHeight = input<number>(0);
  /**
   * When {@link virtual} scrolling is enabled, this input defines the number of items to be rendered above and below the visible area.
   * This can help to reduce flickering when scrolling.
   * @defaultValue `2`
   */
  public readonly padding = input<number>(2);
  /**
   * Determines whether the scroller should have a tab index and be focusable.
   * @defaultValue `false`
   */
  public readonly focusable = input<boolean>(false);
  /**
   * Determines whether an item is sticky or not.
   * If set, the scroller will stick the items with a truthy value for the specified field to the top of the scroller.
   */
  public readonly fieldSticky = input<AllKeysOfUnion<T> | null>(null);

  private readonly _itemList = viewChild.required<ElementRef<HTMLElement>>('itemList');
  private readonly _scrollElementRef = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly _scrollElement = computed(() => this._scrollElementRef().nativeElement);

  private readonly _elementSize = elementSizeSignal(this._scrollElement);

  private readonly _visibleItemCount = computed(() =>
    this.virtual()
      ? Math.ceil(this._elementSize().height / this.itemHeight() + this.padding() * 2)
      : 0
  );
  private readonly _scrollTop = signal(0);
  private readonly _itemStartIndex = computed(() =>
    this.virtual()
      ? Math.max(0, Math.ceil(this._scrollTop() / this.itemHeight()) - this.padding())
      : 0
  );
  private readonly _itemEndIndex = computed(() =>
    this.virtual()
      ? Math.min(this.items().length, this._itemStartIndex() + this._visibleItemCount())
      : 0
  );

  protected readonly visibleItems = computed(() => {
    if (!this.virtual()) {
      return this.items().map((item, index) => ({ item, index }));
    }
    return this.items()
      .slice(this._itemStartIndex(), this._itemEndIndex())
      .map((item, index) => {
        return {
          item,
          index: this._itemStartIndex() + index,
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
      .slice(0, this._itemStartIndex())
      .map((item, index) => ({
        item,
        index,
      }));
    const stickyItems = unrenderedItemsAtTop.filter(item => item.item[stickyField]);
    return stickyItems[stickyItems.length - 1] ?? null;
  });

  protected readonly itemsTop = computed(() => {
    return (this._itemStartIndex() - (this.latestStickyItem() ? 1 : 0)) * this.itemHeight();
  });

  protected readonly dummyHeight = computed(() => {
    return this.items().length * this.itemHeight();
  });

  constructor() {
    super();
    effect(() => {
      if (this.virtual() && !this.itemHeight()) {
        throw new NgnError('scroller', 'itemHeight must be set when virtual is true');
      }
    });

    afterRenderEffect(() => {
      const el = this._scrollElement();
      const obs = fromEvent(el, 'scroll').pipe(map(e => (e.target as HTMLElement).scrollTop));
      obs.pipe(takeUntilDestroyed(this.injector.get(DestroyRef))).subscribe(scrollTop => {
        this._scrollTop.set(scrollTop);
      });
    });
  }

  /**
   * Scrolls the item with the given index into view.
   * @param index The index of the item to scroll to.
   */
  public scrollToIndex(index: number) {
    untracked(() => {
      if (this.virtual()) {
        const scrollTop = this._scrollTop();
        const visibleHeight = this._elementSize().height;
        const itemTop = index * this.itemHeight();
        const itemBottom = itemTop + this.itemHeight();

        if (itemTop < scrollTop) {
          this._scrollElement().scrollTo({
            top: itemTop - 10,
          });
        } else if (itemBottom > scrollTop + visibleHeight) {
          this._scrollElement().scrollTo({
            top: itemBottom - visibleHeight + 10,
          });
        }
      } else {
        const itemElement = this._itemList().nativeElement.querySelector(
          `:nth-child(${index + 1})`
        );
        if (itemElement) {
          itemElement.scrollIntoView({ block: 'nearest' });
        }
      }
    });
  }
}
