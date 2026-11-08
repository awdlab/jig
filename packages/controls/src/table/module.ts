import { NgModule } from '@angular/core';

import { JigTable } from './table';
import { JigTableTd } from './table-td';
import { JigTableFilterableColumn } from './table-filterable-column';
import { JigTableGroupHeaderTr } from './table-group-header-row';
import { JigTableTh } from './table-th';
import { JigTableHeadTr } from './table-head-tr';
import { JigTableReorderableColumn } from './table-reorderable-column';
import { JigTableBodyTr } from './table-body-tr';
import { JigTableRowActions } from './table-row-actions';
import { JigTableRowActionsBar } from './table-row-actions-bar';
import { JigTableSelectionColumn } from './table-selection-column';
import { JigTableSortableColumn } from './table-sortable-column';
import { JigTableStickyColumn } from './table-sticky-column';

@NgModule({
  imports: [
    JigTable,
    JigTableBodyTr,
    JigTableTd,
    JigTableTh,
    JigTableHeadTr,
    JigTableGroupHeaderTr,
    JigTableReorderableColumn,
    JigTableRowActions,
    JigTableRowActionsBar,
    JigTableSelectionColumn,
    JigTableSortableColumn,
    JigTableFilterableColumn,
    JigTableStickyColumn,
  ],
  exports: [
    JigTable,
    JigTableBodyTr,
    JigTableTd,
    JigTableTh,
    JigTableHeadTr,
    JigTableGroupHeaderTr,
    JigTableReorderableColumn,
    JigTableRowActions,
    JigTableRowActionsBar,
    JigTableSelectionColumn,
    JigTableSortableColumn,
    JigTableFilterableColumn,
    JigTableStickyColumn,
  ],
})
export class JigTableModule {}
