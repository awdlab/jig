import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  flatItems,
  mapToItems,
  NgnItem,
  NgnItemFields,
  transformToNgnItems,
} from '@ngneers/controls/api';
import {
  injectThemeTemplate,
  NgnTemplate,
  valueControlBaseProvider,
} from '@ngneers/controls/api/ng';
import { NgnScroller } from '@ngneers/controls/scroller';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

import { ListBoxTemplates, ValueType } from './list-box-templates';

/**
 * @category control
 */
@Component({
  selector: 'ngn-list-box',
  templateUrl: './list-box.html',
  imports: [NgTemplateOutlet, NgnScroller, NgnTemplate, NgClass],
  providers: [valueControlBaseProvider(NgnListBox)],
  host: {
    '[class]': `theme.classes({
      '': true,
      invalid: invalid(),
    })`,
    '[attr.tabIndex]': 'highlightable() ? 0 : null',
    '(keydown)': 'onKeyDown($event)',
    '(focusout)': 'currentHighlightedValue.set(null)',
    role: 'listbox',
    '[attr.aria-activedescendant]':
      'currentHighlightedValue() ? inputId() + "_option_" + currentHighlightedValue() : null',
    '[ariaMultiSelectable]': '!!multiple()',
    '[id]': 'inputId()',
  },
})
export class NgnListBox<
  T extends object,
  K extends keyof T,
  Multiple extends boolean = false,
> extends ListBoxTemplates<T, K, Multiple> {
  protected readonly theme = injectThemeTemplate(listBoxControlTemplate);

  public readonly items = input<readonly NgnItem<T, K>[] | readonly T[]>([]);
  public readonly fields = input<NgnItemFields<T, K>>();

  public readonly scrollToSelectedItemOnInit = input<boolean | ScrollLogicalPosition>(false);
  public readonly selectable = input<boolean>(false);
  public readonly highlightable = input<boolean>(true);
  public readonly virtual = input<boolean>();
  public readonly itemHeight = input<number>();
  public readonly multiple = input<Multiple>();
  private readonly _scroller = viewChild.required<NgnScroller<T>>(NgnScroller);

  protected readonly formattedItems = computed(() => {
    const fields = this.fields();
    const items = this.items();
    if (!fields) {
      return items as NgnItem<T, K>[];
    }
    return transformToNgnItems(items as readonly T[], fields);
  });

  protected readonly flatItems = computed(() => flatItems(this.formattedItems()));
  protected readonly valueArray = computed(() => {
    const v = this.value();
    return Array.isArray(v) ? v : v ? [v] : [];
  });
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

    afterRenderEffect(() => {
      const pos = this.scrollToSelectedItemOnInit();
      if (pos) {
        const val = untracked(this.value);
        const index = flatItems(untracked(this.formattedItems)).findIndex(
          option => option.value === val
        );
        this._scroller().scrollToIndex(index, pos === true ? 'nearest' : pos);
      }
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
            : flattenedItems.findIndex(
                option => option.value === this.valueArray()[this.valueArray().length - 1]
              );

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

  public scrollToIndex(index: number) {
    this._scroller().scrollToIndex(index);
  }

  protected onSelect(value: T[K]) {
    if (this.multiple()) {
      const currentValue = (this.value() as Array<T[K]>) ?? [];
      if (!currentValue.includes(value)) {
        this.onChange([...currentValue, value] as ValueType<T, K, Multiple>);
      } else {
        this.onChange(currentValue.filter(item => item !== value) as ValueType<T, K, Multiple>);
      }
    } else {
      if (this.value() !== value) {
        this.onChange(value as ValueType<T, K, Multiple>);
      }
    }

    this.onTouched();
  }
}
