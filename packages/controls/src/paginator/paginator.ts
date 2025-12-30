import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnBase, provideSelf } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnItemView } from '@ngneers/controls/item-view';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';

import { PaginationState } from './types';

/**
 * @category control
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-paginator',
  templateUrl: './paginator.html',
  imports: [NgnButton, NgnIcon, NgnItemView, NgnTemplate],
  providers: [provideSelf(NgnPaginator)],
  host: {
    '[class]': 'theme.class("")',
  },
})
export class NgnPaginator extends NgnBase<'paginator'> {
  protected readonly theme = this.injectThemeTemplate(paginatorControlTemplate);
  protected readonly i18n = inject(I18n).translations;

  public readonly totalItems = input.required<number>();
  public readonly pageSize = input<number>();
  public readonly possiblePageSizes = input([5, 10, 25, 50], {
    transform: (sizes: number[]) => sizes.sort((a, b) => a - b),
  });

  protected readonly appliedPageSize = computed(
    () => this.pageSize() || this.possiblePageSizes()[0]
  );
  protected readonly pageCount = computed(() =>
    Math.ceil(this.totalItems() / this.appliedPageSize())
  );
  protected readonly pages = computed(() =>
    Array.from({ length: this.pageCount() }, (_, i) => ({ page: i }))
  );

  public readonly value = output<PaginationState>();
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
  }
}
