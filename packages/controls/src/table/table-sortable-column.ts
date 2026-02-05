import {
  ComponentRef,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { injectThemeTemplate, setComponentInput } from '@ngneers/controls/api/ng';
import { getNearestNgnInstanceSig } from '@ngneers/controls/base';
import { NgnIcon } from '@ngneers/controls/icon';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTable } from './table';
import { NgnTableTh } from './table-header-cell';

@Directive({
  selector: '[ngnTableSortableColumn]',
  host: {
    '[class]': `theme.classes({'sortable-column': true, 'sorted-column': !!sort() })`,
    '(click)': `toggleSort()`,
  },
})
export class NgnTableSortableColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);

  public readonly ngnTableSortableColumn = input();

  private readonly _table = getNearestNgnInstanceSig<Type<NgnTable<any, any>>>(
    this._element.nativeElement,
    NgnTable
  );
  protected readonly sort = computed(() => {
    const tableSort = this._table()?.sort();
    if (tableSort?.column === this.columnId()) {
      return tableSort.direction;
    }
    return null;
  });

  private readonly columnId = inject(NgnTableTh).ngnTableTh;

  private readonly _ngnIcon: ComponentRef<NgnIcon>;

  constructor() {
    this._ngnIcon = inject(ViewContainerRef).createComponent(NgnIcon);
    this._element.nativeElement.appendChild(this._ngnIcon.location.nativeElement);
    this._ngnIcon.location.nativeElement.classList.add(this.theme.class('sort-control'));

    effect(() => {
      const sort = this.sort();
      setComponentInput(
        this._ngnIcon,
        'defaultIcon',
        sort === 'asc' ? 'sort_down' : sort === 'desc' ? 'sort_up' : 'sort'
      );
    });
  }

  public ngOnDestroy(): void {
    this._ngnIcon.destroy();
  }

  protected toggleSort(): void {
    const currentSort = this.sort();
    const table = this._table();
    table?.sort.set(
      currentSort === null
        ? { column: this.columnId(), direction: 'asc' }
        : currentSort === 'asc'
          ? { column: this.columnId(), direction: 'desc' }
          : null
    );
  }
}
