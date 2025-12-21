import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import {
  NgnTable,
  NgnTableCell,
  NgnTableHeaderCell,
  NgnTableHeaderRow,
  NgnTableRow,
} from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgnTable,
    NgnTableRow,
    NgnTableCell,
    NgnTableHeaderCell,
    NgnTableHeaderRow,
    NgnTemplate,
  ],
  selector: 'ngn-demo-table-base',
  template: `<ngn-table
    #table
    style="height: 200px"
    [rows]="rows"
    [fieldId]="'id'"
    [virtual]="true"
    [striped]="true"
    [rowHeight]="50"
  >
    <ng-template #header>
      <tr ngnTableHeaderRow>
        <th ngnTableHeaderCell>Id</th>
        <th ngnTableHeaderCell>Name</th>
        <th ngnTableHeaderCell>Department</th>
        <th ngnTableHeaderCell>Location</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableRow]="row">
        <td ngnTableCell>{{ row.data.id }}</td>
        <td ngnTableCell>{{ row.data.name }}</td>
        <td ngnTableCell>{{ row.data.department }}</td>
        <td ngnTableCell>{{ row.data.location }}</td>
      </tr>
    </ng-template>
  </ngn-table>`,
})
export class Demo_Table_Base {
  protected readonly rows = exampleData.table(30);
}
