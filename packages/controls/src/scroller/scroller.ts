import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  inject,
  input,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { elementSizeSignal, templateTypesFn } from '@ngneers/controls/api';
import { fromEvent, map } from 'rxjs';

@Component({
  selector: 'ngn-scroller',
  templateUrl: './scroller.html',
  imports: [NgTemplateOutlet],
  host: {
    style: 'position: relative; overflow: auto; display: block; height: 100%; width: 100%;',
    '[tabIndex]': 'focusable() ? 0 : -1',
  },
})
export class Scroller<T> {
  public readonly virtual = input<boolean | undefined>(false);
  public readonly itemHeight = input<number>(0);
  public readonly padding = input<number>(0);
  private readonly _appliedPadding = computed(() => this.padding() + 2);
  public readonly items = input.required<readonly T[]>();
  public readonly focusable = input<boolean>(false);

  private readonly _itemList = viewChild.required<ElementRef<HTMLElement>>('itemList');
  private readonly _userItemTemplate =
    contentChild<TemplateRef<typeof this.templateTypes.item>>('item');
  public readonly templateItem = input<TemplateRef<typeof this.templateTypes.item> | null>(null);
  protected readonly itemTemplate = computed(() => this._userItemTemplate() ?? this.templateItem());

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _scrollElement: HTMLElement = this._el.nativeElement;
  private readonly _elementSize = elementSizeSignal(this._scrollElement);
  private readonly _visibleItemCount = computed(() =>
    this.virtual()
      ? Math.ceil(this._elementSize().height / this.itemHeight() + this._appliedPadding() * 2)
      : 0
  );
  private readonly _scrollTop = toSignal(
    fromEvent(this._scrollElement, 'scroll').pipe(map(e => (e.target as HTMLElement).scrollTop)),
    { initialValue: 0 }
  );
  private readonly _itemStartIndex = computed(() =>
    this.virtual()
      ? Math.max(0, Math.ceil(this._scrollTop() / this.itemHeight()) - this._appliedPadding())
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

  constructor() {
    effect(() => {
      if (this.virtual() && !this.itemHeight()) {
        throw new Error('Item height must be set when virtual is true');
      }
    });
  }

  public scrollToIndex(index: number) {
    untracked(() => {
      if (this.virtual()) {
        const scrollTop = this._scrollTop();
        const visibleHeight = this._elementSize().height;
        const itemTop = index * this.itemHeight();
        const itemBottom = itemTop + this.itemHeight();

        if (itemTop < scrollTop) {
          this._scrollElement.scrollTo({
            top: itemTop - 10,
          });
        } else if (itemBottom > scrollTop + visibleHeight) {
          this._scrollElement.scrollTo({
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

  protected readonly itemsTop = computed(() => {
    return this._itemStartIndex() * this.itemHeight();
  });

  protected readonly dummyHeight = computed(() => {
    return this.items().length * this.itemHeight();
  });

  public readonly templateTypes = templateTypesFn<{
    item: {
      $implicit: T;
      index: number;
    };
  }>();
}
