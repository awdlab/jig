import { NgModule } from '@angular/core';

import { NgnTable } from './table';
import { NgnTableTd } from './table-cell';
import { NgnTableGroupHeaderTr } from './table-group-header-row';
import { NgnTableTh } from './table-header-cell';
import { NgnTableHeadTr } from './table-header-row';
import { NgnTableReorderableColumn } from './table-reorderable-column';
import { NgnTableBodyTr } from './table-row';
import { NgnTableRowActions } from './table-row-actions';
import { NgnTableRowActionsBar } from './table-row-actions-bar';
import { NgnTableSelectionColumn } from './table-selection-column';
import { NgnTableStickyColumn } from './table-sticky-column';

@NgModule({
  imports: [
    NgnTable,
    NgnTableBodyTr,
    NgnTableTd,
    NgnTableTh,
    NgnTableHeadTr,
    NgnTableGroupHeaderTr,
    NgnTableReorderableColumn,
    NgnTableRowActions,
    NgnTableRowActionsBar,
    NgnTableSelectionColumn,
    NgnTableStickyColumn,
  ],
  exports: [
    NgnTable,
    NgnTableBodyTr,
    NgnTableTd,
    NgnTableTh,
    NgnTableHeadTr,
    NgnTableGroupHeaderTr,
    NgnTableReorderableColumn,
    NgnTableRowActions,
    NgnTableRowActionsBar,
    NgnTableSelectionColumn,
    NgnTableStickyColumn,
  ],
})
export class NgnTableModule {}
