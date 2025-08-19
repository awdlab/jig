import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, ElementRef, input, viewChild, viewChildren } from '@angular/core';
import {
  elementSizeSignal,
  elementsSizesSignal,
  injectThemeTemplate,
} from '@ngneers/controls/api/ng';
import { areArraysDeepEqual } from '@ngneers/controls/utils';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

import { ItemViewTemplates } from './item-view-templates';

/**
 * @category control
 */
@Component({
  selector: 'ngn-item-view',
  templateUrl: './item-view.html',
  imports: [NgClass, NgTemplateOutlet],
  host: {
    '[class]': 'theme.class()',
  },
})
export class NgnItemView<T> extends ItemViewTemplates<T> {
  protected readonly theme = injectThemeTemplate(itemViewControlTemplate);
  /**
   * The items to be displayed in the item view.
   * This is a required input and should be an array of items of type {@link T}.
   */
  public readonly items = input.required<readonly T[]>();
  /**
   * A separator to be displayed between items. Set `true` for `,` or provide a custom string.
   * @default false
   */
  public readonly separator = input<boolean | string>(false);

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

  private readonly _themeGap = computed(() => {
    const elements = this._renderedItemRefs().map(ref => ref.nativeElement);
    if (elements.length <= 1) {
      return 0;
    }
    const el1Left = elements[0].offsetLeft;
    const el2Left = elements[1].offsetLeft;
    const el1Width = this._renderedItemWidths()[0];
    if (!el1Width) {
      return 0;
    }

    return el2Left - el1Left - el1Width;
  });

  protected readonly visibleItemCount = computed(() => {
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

    for (const width of renderedItemWidths) {
      totalWidth += width + this._themeGap();
      if (totalWidth + overflowItemWidth > containerWidth) {
        break;
      }
      count++;
    }

    return count;
  });
  protected readonly moreItemsCount = computed(() => {
    return this.items().length - this.visibleItemCount();
  });

  constructor() {
    super();
  }
}
