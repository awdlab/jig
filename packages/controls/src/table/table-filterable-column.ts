import {
  booleanAttribute,
  TemplateRef,
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
import {
  JigFilterField,
  type JigFilterFieldTemplateContext,
  type JigFilterDataType,
  type JigFilterOperatorId,
} from '@awdlab/jig/filter-field';
import { I18n } from '@awdlab/jig/i18n';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

import { JigTable } from './table';
import { JigTableTh } from './table-header-cell';

import type { JigActionButtonConfig, JigItem } from '@awdlab/jig/api';

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
  private readonly _i18n = inject(I18n).translations;

  /** Enables filtering on this column. The directive selector; its value is unused. */
  public readonly jigTableFilterableColumn = input();

  private readonly _jigActionButton: ComponentRef<JigActionButton<null>>;
  private readonly _jigFilter: ComponentRef<JigFilterField>;

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
  /**
   * For list-based filters, the options to offer: plain strings, or items whose `label` is shown
   * while their `value` is matched. When omitted, options are derived from the column's values.
   */
  public readonly jigTableFilterableColumnItems = input<
    readonly (string | JigItem)[] | null | undefined
  >();
  /**
   * Whether edits in the filter popover apply immediately. When `false`, the popover shows
   * apply / cancel buttons and the column filters only once the user applies.
   * @default true
   */
  public readonly jigTableFilterableColumnAutoApply = input(true, { transform: booleanAttribute });
  /**
   * Whether the user can add several conditions joined by match-all / match-any.
   * Has no effect for `list` columns.
   * @default true
   */
  public readonly jigTableFilterableColumnAllowMultiple = input(true, {
    transform: booleanAttribute,
  });
  /**
   * Replaces this column's filter popover with your own editor — a slider, a rating,
   * a lookup against your backend. It writes a `JigFilterConfig` back through the
   * context's `setValue`, so the column filters exactly as a built-in one does.
   */
  public readonly jigTableFilterableColumnTemplate =
    input<TemplateRef<JigFilterFieldTemplateContext> | null>(null);
  /**
   * Restricts and orders the operators offered for this column. Ids the column type does not
   * support are ignored; when empty, all operators of the type are offered.
   */
  public readonly jigTableFilterableColumnOperators = input<
    readonly JigFilterOperatorId[] | null | undefined
  >();
  /**
   * Operator a new condition on this column starts with. Must be part of
   * {@link jigTableFilterableColumnOperators}, otherwise the first one is used.
   */
  public readonly jigTableFilterableColumnDefaultOperator = input<
    JigFilterOperatorId | null | undefined
  >();
  /**
   * Accessible label of the filter trigger. Defaults to the translated `table.filter`
   * text; set it to name the column, e.g. `Filter by name`.
   */
  public readonly jigTableFilterableColumnLabel = input<string | null | undefined>();

  constructor() {
    this._jigActionButton = inject(ViewContainerRef).createComponent(JigActionButton<null>);
    this._jigFilter = inject(ViewContainerRef).createComponent(JigFilterField);
    this._element.nativeElement.appendChild(this._jigActionButton.location.nativeElement);
    this._element.nativeElement.appendChild(this._jigFilter.location.nativeElement);
    this._jigActionButton.location.nativeElement.classList.add(this.theme.class('filter-control'));

    setComponentInput(this._jigActionButton, 'kind', 'icon');
    setComponentInput(this._jigActionButton, 'inline', true);
    setComponentInput(this._jigFilter, 'anchor', this._jigActionButton.location.nativeElement);
    setComponentInput(this._jigFilter, 'mode', 'headless');
    // The table applies the filter; the popover only ever emits its config.
    setComponentInput(this._jigFilter, 'filterLocally', false);

    const cfg = computed(
      () =>
        <JigActionButtonConfig<null>>{
          label: this.jigTableFilterableColumnLabel() || this._i18n['table_filter'](),
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
    effect(() => {
      setComponentInput(this._jigFilter, 'autoApply', this.jigTableFilterableColumnAutoApply());
    });
    effect(() => {
      setComponentInput(
        this._jigFilter,
        'allowMultiple',
        this.jigTableFilterableColumnAllowMultiple()
      );
    });
    effect(() => {
      setComponentInput(this._jigFilter, 'templateFilter', this.jigTableFilterableColumnTemplate());
    });
    effect(() => {
      setComponentInput(this._jigFilter, 'operators', this.jigTableFilterableColumnOperators());
    });
    effect(() => {
      setComponentInput(
        this._jigFilter,
        'defaultOperator',
        this.jigTableFilterableColumnDefaultOperator()
      );
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
