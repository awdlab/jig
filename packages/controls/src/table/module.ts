import { NgModule } from '@angular/core';

import { AwdTable } from './table';
import { AwdTableTd } from './table-cell';
import { AwdTableGroupHeaderTr } from './table-group-header-row';
import { AwdTableTh } from './table-header-cell';
import { AwdTableHeadTr } from './table-header-row';
import { AwdTableReorderableColumn } from './table-reorderable-column';
import { AwdTableBodyTr } from './table-row';
import { AwdTableRowActions } from './table-row-actions';
import { AwdTableRowActionsBar } from './table-row-actions-bar';
import { AwdTableSelectionColumn } from './table-selection-column';
import { AwdTableStickyColumn } from './table-sticky-column';

@NgModule({
  imports: [
    AwdTable,
    AwdTableBodyTr,
    AwdTableTd,
    AwdTableTh,
    AwdTableHeadTr,
    AwdTableGroupHeaderTr,
    AwdTableReorderableColumn,
    AwdTableRowActions,
    AwdTableRowActionsBar,
    AwdTableSelectionColumn,
    AwdTableStickyColumn,
  ],
  exports: [
    AwdTable,
    AwdTableBodyTr,
    AwdTableTd,
    AwdTableTh,
    AwdTableHeadTr,
    AwdTableGroupHeaderTr,
    AwdTableReorderableColumn,
    AwdTableRowActions,
    AwdTableRowActionsBar,
    AwdTableSelectionColumn,
    AwdTableStickyColumn,
  ],
})
export class AwdTableModule {}
