import { Component } from '@angular/core';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [AwdTableModule, AwdTemplate],
  selector: 'jig-demo-table-base',
  template: `<jig-table #table style="height: 400px" [rows]="rows" [fieldId]="'id'">
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
  </jig-table>`,
})
export class Demo_Table_Base {
  protected readonly rows = exampleData.table(100);
}
