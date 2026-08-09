import { Component } from '@angular/core';
import { NgnTemplate } from '@awdlab/jig/api/ng';
import { NgnTableModule, NgnTableSortableColumn } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnTableModule, NgnTableSortableColumn, NgnTemplate],
  selector: 'awd-demo-table-sorting',
  template: `<awd-table #table style="height: 400px" [rows]="rows" [fieldId]="'id'">
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')" [ngnTableSortableColumn]>ID</th>
        <th [ngnTableTh]="table.column('name')" [ngnTableSortableColumn]>Name</th>
        <th [ngnTableTh]="table.column('department')" [ngnTableSortableColumn]>Department</th>
        <th [ngnTableTh]="table.column('location')" [ngnTableSortableColumn]>Location</th>
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
export class Demo_Table_Sorting {
  protected readonly rows = exampleData.table(100);
}
