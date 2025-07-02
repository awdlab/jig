import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  ElementRef,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { elementSizeSignal } from '@ngneers/controls/api';
import { fromEvent, map } from 'rxjs';

@Component({
  selector: 'ngn-scroller',
  templateUrl: './scroller.html',
  imports: [NgTemplateOutlet],
  host: {
    style: 'position: relative; overflow: auto; display: block; max-height: 100%; max-width: 100%;',
  },
})
export class Scroller<T> {
  public readonly itemTemplate =
    contentChild.required<TemplateRef<{ $implicit: T }>>('itemTemplate');
  public readonly itemHeight = input.required<number>();
  public readonly padding = input<number>(0);
  public readonly items = input.required<T[]>();

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _scrollElement: HTMLElement = this._el.nativeElement;
  private readonly _elementSize = elementSizeSignal(this._scrollElement);
  private readonly _visibleItemCount = computed(() =>
    Math.ceil(this._elementSize().height / this.itemHeight() + this.padding() * 2)
  );
  private readonly _scrollTop = toSignal(
    fromEvent(this._scrollElement, 'scroll').pipe(map(e => (e.target as HTMLElement).scrollTop)),
    { initialValue: 0 }
  );
  private readonly _itemStartIndex = computed(() =>
    Math.max(0, Math.ceil(this._scrollTop() / this.itemHeight()) - this.padding())
  );
  private readonly _itemEndIndex = computed(() =>
    Math.min(this.items().length, this._itemStartIndex() + this._visibleItemCount())
  );

  public readonly visibleItems = computed(() => {
    return this.items()
      .slice(this._itemStartIndex(), this._itemEndIndex())
      .map((item, index) => {
        return {
          item,
          index: this._itemStartIndex() + index,
        };
      });
  });

  protected readonly itemsTop = computed(() => {
    return this._itemStartIndex() * this.itemHeight();
  });

  protected readonly dummyHeight = computed(() => {
    return this.items().length * this.itemHeight();
  });
}
