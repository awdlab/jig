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
import { getNearestJigInstanceSig } from '@awdlab/jig/base';
import { JigIcon } from '@awdlab/jig/icon';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { JigTable } from './table';
import { JigTableTh } from './table-header-cell';

/**
 * @category directive
 */
@Directive({
  selector: '[jigTableSortableColumn]',
  host: {
    '[class]': `theme.classes({'sortable-column': true, 'sorted-column': !!sort() })`,
    '[attr.aria-sort]': `sort() === 'asc' ? 'ascending' : sort() === 'desc' ? 'descending' : 'none'`,
    '(click)': `onHostClick($event)`,
  },
})
export class JigTableSortableColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Enables sorting on this column. The directive selector; its value is unused. */
  public readonly jigTableSortableColumn = input();

  private readonly _table = getNearestJigInstanceSig<Type<JigTable<any, any>>>(
    this._element.nativeElement,
    JigTable
  );
  protected readonly sort = computed(() => {
    const tableSort = this._table()?.sort();
    if (tableSort?.column === this.columnId()) {
      return tableSort.direction;
    }
    return null;
  });

  private readonly columnId = inject(JigTableTh).jigTableTh;

  private readonly _jigIcon: ComponentRef<JigIcon>;
  private _sortButton?: HTMLElement;

  private readonly onSortKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    this.toggleSort();
  };

  constructor() {
    // Runs after JigTableTh's own hook, which wraps the header content in the
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

    this._jigIcon = inject(ViewContainerRef).createComponent(JigIcon);
    this._element.nativeElement.appendChild(this._jigIcon.location.nativeElement);
    this._jigIcon.location.nativeElement.classList.add(this.theme.class('sort-control'));

    effect(() => {
      const sort = this.sort();
      setComponentInput(
        this._jigIcon,
        'defaultIcon',
        sort === 'asc' ? 'sort-ascending' : sort === 'desc' ? 'sort-descending' : 'sort-neutral'
      );
    });
  }

  public ngOnDestroy(): void {
    this._sortButton?.removeEventListener('keydown', this.onSortKeyDown);
    this._jigIcon.destroy();
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
