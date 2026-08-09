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
import { injectThemeTemplate, setComponentInput } from '@awdlab/jig/api/ng';
import { getNearestJigInstanceSig } from '@awdlab/jig/base';
import { JigActionButton } from '@awdlab/jig/button';
import { JigFilter, type JigFilterDataType } from '@awdlab/jig/filter';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { JigTable } from './table';
import { JigTableTh } from './table-header-cell';

import type { JigActionButtonConfig } from '@awdlab/jig/api';

/**
 * @category directive
 */
@Directive({
  selector: '[jigTableFilterableColumn]',
  host: {
    '[class]': `theme.classes({'filterable-column': true, 'filtered-column': !!filter() })`,
  },
})
export class JigTableFilterableColumn implements OnDestroy {
  protected readonly theme = injectThemeTemplate(tableControlTemplate);
  private readonly _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _columnId = inject(JigTableTh).jigTableTh;

  /** Enables filtering on this column. The directive selector; its value is unused. */
  public readonly jigTableFilterableColumn = input();

  private readonly _jigActionButton: ComponentRef<JigActionButton<null>>;
  private readonly _jigFilter: ComponentRef<JigFilter>;

  private readonly _table = getNearestJigInstanceSig<Type<JigTable<any, any>>>(
    this._element.nativeElement,
    JigTable
  );
  private readonly _rows = computed(() => {
    return this._table()?.rows() || [];
  });
  protected readonly filter = computed(() => {
    const tableFilter = this._table()?.filters()?.[this._columnId()];
    return tableFilter;
  });

  /** The data type of the column, which determines the available filter operators and UI. */
  public readonly jigTableFilterableColumnType = input.required<JigFilterDataType>();
  /** For list-based filters, the set of selectable option values to offer. */
  public readonly jigTableFilterableColumnItems = input<string[] | null | undefined>();

  constructor() {
    this._jigActionButton = inject(ViewContainerRef).createComponent(JigActionButton<null>);
    this._jigFilter = inject(ViewContainerRef).createComponent(JigFilter);
    this._element.nativeElement.appendChild(this._jigActionButton.location.nativeElement);
    this._element.nativeElement.appendChild(this._jigFilter.location.nativeElement);
    this._jigActionButton.location.nativeElement.classList.add(this.theme.class('filter-control'));

    setComponentInput(this._jigActionButton, 'kind', 'icon');
    setComponentInput(this._jigActionButton, 'inline', true);
    setComponentInput(this._jigFilter, 'anchor', this._jigActionButton.location.nativeElement);
    setComponentInput(this._jigFilter, 'mode', 'headless');
    setComponentInput(this._jigFilter, 'allowMultiple', true);

    const cfg = computed(
      () =>
        <JigActionButtonConfig<null>>{
          label: 'Filter',
          value: null,
          kind: 'icon',
          defaultIcon: this.filter() ? 'filter-active' : 'filter-inactive',
          action: event => {
            event?.stopPropagation();
            this._jigFilter.instance.show();
          },
        }
    );

    effect(() => {
      setComponentInput(this._jigActionButton, 'config', cfg());
    });
    effect(() => {
      setComponentInput(
        this._jigFilter,
        'data',
        this._rows().map(row => row[this._columnId()])
      );
    });
    effect(() => {
      setComponentInput(this._jigFilter, 'dataType', this.jigTableFilterableColumnType());
    });
    effect(() => {
      setComponentInput(this._jigFilter, 'listOptions', this.jigTableFilterableColumnItems());
    });
    this._jigFilter.instance.filterChange.subscribe(cfg => {
      const table = this._table();
      const currentFilters = table?.filters() || {};
      table?.filters.set({ ...currentFilters, [this._columnId()]: cfg ?? undefined });
    });
  }

  public ngOnDestroy(): void {
    this._jigActionButton.destroy();
    this._jigFilter.destroy();
  }
}
