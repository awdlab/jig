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

import { ItemViewTemplates } from './item-view-templates';
import { OverflowStrategy } from './types';

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
export class NgnItemView<T extends object, idField extends keyof T>
  extends ItemViewTemplates<T>
  implements AfterViewInit
{
  protected readonly theme = this.injectThemeTemplate(itemViewControlTemplate);
  /**
   * The key of the id property in the item object. This is used to track items in the template.
   */
  public readonly idField = input.required<idField>();
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

  private readonly _themeGap = signal(0);
  private readonly _isBrowser = inject(Platform).isBrowser;

  protected readonly separatorChar = computed(() => {
    const sep = this.separator();
    if (typeof sep === 'boolean') {
      return sep ? ', ' : '';
    }
    return sep;
  });

  private readonly _renderedItemRefs = viewChildren<ElementRef<HTMLElement>>('item');
  private readonly _renderedItemSizes = elementsSizesSignal(this._renderedItemRefs);
  private readonly _renderedItemWidths = computed(
    () => this._renderedItemSizes().map(size => size.width),
    { equal: areArraysDeepEqual }
  );
  private readonly _containerSize = elementSizeSignal(this.element.nativeElement);
  private readonly _overflowItemRef = viewChild<ElementRef<HTMLElement>>('overflowItem');
  private readonly _overflowItemSize = elementSizeSignal(this._overflowItemRef);

  protected readonly itemOverflowCheckOrder = computed(() => {
    const count = this.items().length;
    switch (this.overflowStrategy()) {
      case 'end':
        return Array.from({ length: count }, (_, i) => i);
      case 'endButOne': {
        const arr = [...Array.from({ length: count - 1 }, (_, i) => i)];
        arr.splice(1, 0, count - 1);
        return arr;
      }
      case 'start':
        return Array.from({ length: count }, (_, i) => count - i - 1);
      case 'startButOne': {
        const arr = [...Array.from({ length: count - 1 }, (_, i) => count - i - 1)];
        arr.splice(1, 0, 0);
        return arr;
      }
      case 'center': {
        const order = [];
        let leftIndex = 0;
        let rightIndex = count - 1;

        for (let i = 0; i < count; i++) {
          if (i % 2 === 0) {
            order.push(leftIndex++);
          } else {
            order.push(rightIndex--);
          }
        }
        return order;
      }
      default:
        throw new Error(`Unknown overflow strategy: ${this.overflowStrategy()}`);
    }
  });

  private readonly _visibleItemCount = computed(() => {
    if (!this._renderedItemWidths().length) {
      return this.items().length;
    }
    const containerWidth = this._containerSize().width;
    const renderedItemWidths = this._renderedItemWidths();
    const overflowItemWidth = this._overflowItemSize().width;

    if (
      containerWidth >=
      renderedItemWidths.reduce((a, b) => a + b, 0) + (this.items().length - 1) * this._themeGap()
    ) {
      return renderedItemWidths.length;
    }

    let totalWidth = 0;
    let count = 0;
    for (let i = 0; i < renderedItemWidths.length; i++) {
      const width = renderedItemWidths[this.itemOverflowCheckOrder()[i]];
      totalWidth += width + this._themeGap();
      if (totalWidth + overflowItemWidth > containerWidth) {
        break;
      }
      count++;
    }

    return count;
  });

  protected readonly visibleItemIndices = computed(() => {
    return Array.from(
      { length: this._visibleItemCount() },
      (_, i) => this.itemOverflowCheckOrder()[i]
    ).toSorted();
  });

  protected readonly overflowingItems = computed(() => {
    const visibleItemIndices = this.visibleItemIndices();
    return this.items().filter((_, i) => !visibleItemIndices.includes(i));
  });

  protected readonly hasRenderedItemAfterOverflowItem = computed(() => {
    const arr = [this.overflowItemIndex(), ...this.visibleItemIndices()].toSorted();
    return !!arr[arr.indexOf(this.overflowItemIndex()) + 1];
  });

  protected readonly overflowItemIndex = computed(() => {
    return this.itemOverflowCheckOrder()[this._visibleItemCount()];
  });

  protected readonly moreItemsCount = computed(() => {
    return this.items().length - this._visibleItemCount();
  });

  constructor() {
    super();
  }

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
