import { Component } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnTableModule, NgnTemplate],
  selector: 'awd-demo-table-grouping',
  template: `<awd-table
    #table
    style="height: 500px"
    [rows]="rows"
    [fieldId]="'id'"
    [groupBy]="'department'"
    [rowHeight]="40"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
        <th [ngnTableTh]="table.column('department')">Department</th>
        <th [ngnTableTh]="table.column('location')">Location</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd>{{ row.data.name }}</td>
        <td ngnTableTd>{{ row.data.department }}</td>
        <td ngnTableTd>{{ row.data.location }}</td>
      </tr>
    </ng-template>
  </awd-table>`,
})
export class Demo_Table_Grouping {
  protected readonly rows = exampleData.table(50);
}
