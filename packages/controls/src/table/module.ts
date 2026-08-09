import { NgModule } from '@angular/core';

import { JigTable } from './table';
import { JigTableTd } from './table-cell';
import { JigTableGroupHeaderTr } from './table-group-header-row';
import { JigTableTh } from './table-header-cell';
import { JigTableHeadTr } from './table-header-row';
import { JigTableReorderableColumn } from './table-reorderable-column';
import { JigTableBodyTr } from './table-row';
import { JigTableRowActions } from './table-row-actions';
import { JigTableRowActionsBar } from './table-row-actions-bar';
import { JigTableSelectionColumn } from './table-selection-column';
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
    JigTableStickyColumn,
  ],
})
export class JigTableModule {}
