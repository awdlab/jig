import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, signal, viewChild } from '@angular/core';
import {
  flatItems,
  injectThemeTemplate,
  mapToItems,
  NgnItem,
  NgnItemFields,
  NgnTemplate,
  transformToNgnItems,
  valueControlBaseProvider,
} from '@ngneers/controls/api';
import { Scroller } from '@ngneers/controls/scroller';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

import { ListBoxTemplates } from './list-box-templates';

@Component({
  selector: 'ngn-list-box',
  templateUrl: './list-box.html',
  imports: [NgTemplateOutlet, Scroller, NgnTemplate, NgClass],
  providers: [valueControlBaseProvider(ListBox)],
})
export class ListBox<T extends object, K extends keyof T> extends ListBoxTemplates<T, K> {
  protected readonly theme = injectThemeTemplate(listBoxControlTemplate);

  public readonly items = input<readonly NgnItem<T, K>[] | readonly T[]>([]);
  public readonly fields = input<NgnItemFields<T, K>>();

  public readonly selectable = input<boolean>(false);
  public readonly highlightable = input<boolean>(true);
  public readonly virtual = input<boolean>();
  public readonly itemHeight = input<number>();
  private readonly _scroller = viewChild.required<Scroller<T>>(Scroller);

  protected readonly formattedItems = computed(() => {
    const fields = this.fields();
    const items = this.items();
    if (!fields) {
      return items as NgnItem<T, K>[];
    }
    return transformToNgnItems(items as readonly T[], fields);
  });

  protected readonly flatItems = computed(() => flatItems(this.formattedItems()));

  protected readonly currentHighlightedValue = signal<T[K] | null>(null);

  constructor() {
    super();

    effect(() => {
      const currentHighlightedValue = this.currentHighlightedValue();
      if (!currentHighlightedValue) {
        return;
      }
      const index = flatItems(this.formattedItems()).findIndex(
        option => option.value === currentHighlightedValue
      );
      this._scroller().scrollToIndex(index);
    });
  }

  public onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.stopPropagation();
      event.preventDefault();
      const flattenedItems = mapToItems(this.formattedItems());
      this.currentHighlightedValue.update(currentValue => {
        const currentHighlightIndex = flattenedItems.findIndex(
          option => option.value === currentValue
        );
        if (flattenedItems.length === 0) {
          return null;
        }
        const currentIndex =
          currentHighlightIndex >= 0
            ? currentHighlightIndex
            : flattenedItems.findIndex(option => option.value === this.value());

        if (currentIndex === -1) {
          return event.key === 'ArrowDown'
            ? flattenedItems[0].value
            : flattenedItems[flattenedItems.length - 1].value;
        }

        const nextIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0) {
          return flattenedItems[flattenedItems.length - 1].value;
        }
        if (nextIndex >= flattenedItems.length) {
          return flattenedItems[0].value;
        }
        return flattenedItems[nextIndex].value;
      });
    } else if (this.selectable() && (event.key === 'Enter' || event.key === ' ')) {
      const currentHighlightedValue = this.currentHighlightedValue();
      if (currentHighlightedValue !== null) {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.onSelect(currentHighlightedValue);
      }
    }
  }

  protected onSelect(value: T[K]) {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
    this.currentHighlightedValue.set(null);
  }
}
