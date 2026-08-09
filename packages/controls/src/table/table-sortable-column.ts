import {
  afterNextRender,
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
import { injectThemeTemplate, setComponentInput } from '@awdlab/jig/api/ng';
import { getNearestAwdInstanceSig } from '@awdlab/jig/base';
import { AwdIcon } from '@awdlab/jig/icon';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { AwdTable } from './table';
import { AwdTableTh } from './table-header-cell';

/**
 * @category directive
 */
@Directive({
  selector: '[ngnTableSortableColumn]',
  host: {
    '[class]': `theme.classes({'sortable-column': true, 'sorted-column': !!sort() })`,
    '[attr.aria-sort]': `sort() === 'asc' ? 'ascending' : sort() === 'desc' ? 'descending' : 'none'`,
    '(click)': `onHostClick($event)`,
  },
})
export class AwdTableSortableColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Enables sorting on this column. The directive selector; its value is unused. */
  public readonly ngnTableSortableColumn = input();

  private readonly _table = getNearestAwdInstanceSig<Type<AwdTable<any, any>>>(
    this._element.nativeElement,
    AwdTable
  );
  protected readonly sort = computed(() => {
    const tableSort = this._table()?.sort();
    if (tableSort?.column === this.columnId()) {
      return tableSort.direction;
    }
    return null;
  });

  private readonly columnId = inject(AwdTableTh).ngnTableTh;

  private readonly _ngnIcon: ComponentRef<AwdIcon>;
  private _sortButton?: HTMLElement;

  private readonly onSortKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    this.toggleSort();
  };

  constructor() {
    // Runs after AwdTableTh's own hook, which wraps the header content in the
    // `cell-text` span — that span becomes the sort button.
    afterNextRender(() => {
      const text = this._element.nativeElement.querySelector<HTMLElement>(
        `.${this.theme.class('cell-text')}`
      );
      if (!text) return;
      text.setAttribute('role', 'button');
      text.setAttribute('tabindex', '0');
      text.addEventListener('keydown', this.onSortKeyDown);
      this._sortButton = text;
    });

    this._ngnIcon = inject(ViewContainerRef).createComponent(AwdIcon);
    this._element.nativeElement.appendChild(this._ngnIcon.location.nativeElement);
    this._ngnIcon.location.nativeElement.classList.add(this.theme.class('sort-control'));

    effect(() => {
      const sort = this.sort();
      setComponentInput(
        this._ngnIcon,
        'defaultIcon',
        sort === 'asc' ? 'sort-ascending' : sort === 'desc' ? 'sort-descending' : 'sort-neutral'
      );
    });
  }

  public ngOnDestroy(): void {
    this._sortButton?.removeEventListener('keydown', this.onSortKeyDown);
    this._ngnIcon.destroy();
  }

  protected onHostClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains(this.theme.class('resize-handle'))) return;
    this.toggleSort();
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
