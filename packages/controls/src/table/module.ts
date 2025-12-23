import { NgModule } from '@angular/core';

import { NgnTable } from './table';
import { NgnTableTd } from './table-cell';
import { NgnTableTh } from './table-header-cell';
import { NgnTableHeadTr } from './table-header-row';
import { NgnTableBodyTr } from './table-row';

@NgModule({
  imports: [NgnTable, NgnTableBodyTr, NgnTableTd, NgnTableTh, NgnTableHeadTr],
  exports: [NgnTable, NgnTableBodyTr, NgnTableTd, NgnTableTh, NgnTableHeadTr],
})
export class NgnTableModule {}
