import { NgTemplateOutlet, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { executeMultiFilter } from '@ngneers/controls/api';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { provideSelf } from '@ngneers/controls/base';
import { NgnFilterConfig } from '@ngneers/controls/filter';
import { NgnScroller } from '@ngneers/controls/scroller';
import { AllKeysOfUnion } from '@ngneers/controls/utils';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

import { NgnTableTemplates } from './table-templates';
import { FormattedTableRow } from './types';

import type { NgnTableTh } from './table-header-cell';

@Component({
  selector: 'ngn-table',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, NgnScroller, NgnTemplate, NgClass],
  providers: [provideSelf(NgnTable)],
  host: {
    '[class]': `theme.classes({
      '': true,
    })`,
    tabindex: '0',
  },
})
export class NgnTable<T extends object, K extends keyof T> extends NgnTableTemplates<T> {
  protected readonly theme = this.injectThemeTemplate(tableControlTemplate);
  private readonly _registeredHeaderCells = signal<NgnTableTh[]>([]);

  public readonly rows = input.required<readonly T[]>();
  public readonly rowHeight = input<number>();
  public readonly fieldId = input.required<K>();
  public readonly virtual = input<boolean>(false);
  public readonly virtualPadding = input<number>(2);
  public readonly striped = input<boolean>(false);
  protected readonly trackById = (item: T): unknown => item[this.fieldId()];
  public readonly sort = model<{
    column: Extract<AllKeysOfUnion<T>, string>;
    direction: 'asc' | 'desc';
  } | null>(null);
  public readonly filters = model<
    | {
        [key in Extract<AllKeysOfUnion<T>, string>]?: NgnFilterConfig;
      }
    | null
  >(null);

  protected readonly formattedRows = computed<FormattedTableRow<T>[]>(() => {
    const rows = this._sortedRows();
    return rows.map((data, index) => ({
      kind: 'data' as const,
      id: data[this.fieldId()] as T[keyof T] & (string | number),
      data,
      index,
    }));
  });

  private readonly _filteredRows = computed<readonly T[]>(() => {
    const filters = this.filters();
    const rows = this.rows();
    if (!filters) {
      return rows;
    }
    return executeMultiFilter(rows, filters);
  });

  private readonly _sortedRows = computed<readonly T[]>(() => {
    const rows = this._filteredRows();
    const sort = this.sort();
    if (!sort) {
      return rows;
    }
    const { column, direction } = sort;
    // @jasc @todo outsource sorting & allow custom sort functions
    return rows.toSorted((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue == null && bValue != null) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue != null && bValue == null) {
        return direction === 'asc' ? 1 : -1;
      }
      if (aValue == null && bValue == null) {
        return 0;
      }
      return typeof aValue === 'number' && typeof bValue === 'number'
        ? direction === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number)
        : direction === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
    });
  });

  protected readonly columnCount = computed(() => this._registeredHeaderCells().length);
  public column<V extends AllKeysOfUnion<T> & string>(column: V): V {
    return column;
  }

  public registerHeaderCell(cell: NgnTableTh): void {
    this._registeredHeaderCells.update(cells => [...cells, cell]);
  }

  public unregisterHeaderCell(cell: NgnTableTh): void {
    this._registeredHeaderCells.update(cells => cells.filter(c => c !== cell));
  }
}
