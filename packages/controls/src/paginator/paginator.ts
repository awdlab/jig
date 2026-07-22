import { NgStyle, NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnItemView } from '@ngneers/controls/item-view';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnError, throwExp } from '@ngneers/controls/utils';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';

import type { PaginationState } from './types';
import type { NgnItem } from '@ngneers/controls/api';

/**
 * @category control
 */
@Component({
  selector: 'ngn-paginator',
  templateUrl: './paginator.html',
  imports: [
    NgnButton,
    NgnIcon,
    NgnItemView,
    NgnSelect,
    NgnTemplate,
    NgStyle,
    NgnPt,
    NgnInputField,
    NgClass,
  ],
  providers: [provideSelf(NgnPaginator)],
})
export class NgnPaginator extends NgnBase<'paginator'> {
  protected readonly theme = this.injectThemeTemplate(paginatorControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;

  /**
   * Total number of items to paginate. Required in `'pages'` mode (drives the
   * page count); ignored in `'compact'` mode.
   */
  public readonly totalItems = input<number>();
  /**
   * Number of items per page. If not set, the first value from {@link possiblePageSizes} is used.
   */
  public readonly pageSize = model<number>();
  /**
   * Layout mode.
   * - `'pages'`: full paginator with numbered page buttons (needs {@link totalItems}).
   * - `'compact'`: prev/next buttons only, no page indicators, no total required.
   * @default 'pages'
   */
  public readonly mode = input<'pages' | 'compact'>('pages');
  /**
   * `'compact'` mode only: whether a next page exists. Disables the "next" button
   * when `false`. Bind to a lazy data source's `hasMore`.
   * @default true
   */
  public readonly hasNext = input(true, { transform: booleanAttribute });
  /**
   * Possible page sizes to choose from.
   * @default [5, 10, 25, 50]
   */
  public readonly possiblePageSizes = input([5, 10, 25, 50], {
    transform: (sizes: number[]) => sizes.sort((a, b) => a - b),
  });
  /**
   * If set to `true`, the page size selector will be hidden and the page size cannot be changed by the user.
   * @default false
   */
  public readonly fixedPageSize = input(false, { transform: booleanAttribute });

  protected readonly appliedPageSize = computed(
    () =>
      this.pageSize() ||
      this.possiblePageSizes()[0] ||
      throwExp('NgnPaginator', 'At least one page size must be provided')
  );
  protected readonly pageCount = computed(() =>
    Math.ceil((this.totalItems() ?? 0) / this.appliedPageSize())
  );
  protected readonly pages = computed(() =>
    Array.from({ length: this.pageCount() }, (_, i) => ({ page: i }))
  );
  protected readonly pageSizeOptions = computed<NgnItem[]>(() =>
    this.possiblePageSizes().map(size => ({
      label: size.toString(),
      value: size,
    }))
  );

  /**
   * Emits the current pagination state whenever the page or page size changes.
   */
  public readonly value = output<PaginationState>();
  /**
   * Current page index (zero-based).
   * @default 0
   */
  public readonly page = model(0);

  constructor() {
    super();
    effect(() => {
      const page = this.page();
      const pageSize = this.appliedPageSize();
      this.value.emit({
        page: {
          current: page,
          size: pageSize,
        },
        slice: {
          skip: page * pageSize,
          take: pageSize,
        },
      });
    });
    effect(() => {
      if (this.mode() === 'pages' && this.totalItems() === undefined) {
        throw new NgnError('paginator', "totalItems is required in 'pages' mode");
      }
    });
  }

  protected previousPage(event: PointerEvent): void {
    // Compact mode is cursor pagination — sequential, so no shift/ctrl multi-jump.
    const amount = this.mode() === 'compact' ? 1 : event.shiftKey ? 10 : event.ctrlKey ? 100 : 1;
    const newPage = Math.max(this.page() - amount, 0);
    this.page.set(newPage);
  }

  protected nextPage(event: PointerEvent): void {
    if (this.mode() === 'compact') {
      if (!this.hasNext()) return;
      this.page.set(this.page() + 1);
      return;
    }
    const amount = event.shiftKey ? 10 : event.ctrlKey ? 100 : 1;
    const newPage = Math.min(this.page() + amount, this.pageCount() - 1);
    this.page.set(newPage);
  }

  protected getButtonFontStyles(page: number): {
    [klass: string]: string;
  } {
    function getFontSizeMultiplier() {
      const charCount = (page + 1).toString().length;
      if (charCount <= 2) {
        return 1;
      }
      return Math.pow(0.85, charCount - 2);
    }

    return {
      fontSize: `${getFontSizeMultiplier()}em`,
      width: 'calc(1rem + 2 * var(--padding))',
      height: 'calc(1rem + 2 * var(--padding))',
      lineHeight: '0',
    };
  }
}
