import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  NgnTable,
  NgnTableCell,
  NgnTableColumnHeader,
  NgnTableHeaderRow,
  NgnTableRow,
} from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTable, NgnTableRow, NgnTableCell, NgnTableColumnHeader, NgnTableHeaderRow],
  selector: 'ngn-demo-table-base',
  template: `<ngn-table
    style="height: 200px"
    [rows]="rows"
    [fieldId]="'id'"
    [virtual]="true"
    [rowHeight]="50"
  >
    <ng-template #header>
      <div ngnTableHeaderRow>
        <div ngnTableColumnHeader>Id</div>
        <div ngnTableColumnHeader>Name</div>
        <div ngnTableColumnHeader>Department</div>
        <div ngnTableColumnHeader>Location</div>
      </div>
    </ng-template>
    <ng-template #body let-row>
      <div [ngnTableRow]="row">
        <div ngnTableCell>{{ row.data.id }}</div>
        <div ngnTableCell>{{ row.data.name }}</div>
        <div ngnTableCell>{{ row.data.department }}</div>
        <div ngnTableCell>{{ row.data.location }}</div>
      </div>
    </ng-template>
  </ngn-table>`,
})
export class Demo_Table_Base {
  protected readonly rows = exampleData.table(20);
}
