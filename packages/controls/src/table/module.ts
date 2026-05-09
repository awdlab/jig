import { NgModule } from '@angular/core';

import { NgnTable } from './table';
import { NgnTableTd } from './table-cell';
import { NgnTableGroupHeaderTr } from './table-group-header-row';
import { NgnTableTh } from './table-header-cell';
import { NgnTableHeadTr } from './table-header-row';
import { NgnTableReorderableColumn } from './table-reorderable-column';
import { NgnTableBodyTr } from './table-row';
import { NgnTableSelectionColumn } from './table-selection-column';

@NgModule({
  imports: [
    NgnTable,
    NgnTableBodyTr,
    NgnTableTd,
    NgnTableTh,
    NgnTableHeadTr,
    NgnTableGroupHeaderTr,
    NgnTableReorderableColumn,
    NgnTableSelectionColumn,
  ],
  exports: [
    NgnTable,
    NgnTableBodyTr,
    NgnTableTd,
    NgnTableTh,
    NgnTableHeadTr,
    NgnTableGroupHeaderTr,
    NgnTableReorderableColumn,
    NgnTableSelectionColumn,
  ],
})
export class NgnTableModule {}
