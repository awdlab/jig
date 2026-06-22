import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableModule } from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnTableModule, NgnTemplate],
  selector: 'ngn-demo-table-virtual',
  template: `<ngn-table
    #table
    style="height: 400px"
    [rows]="rows"
    [fieldId]="'id'"
    [virtual]="true"
    [virtualPadding]="12"
    [rowHeight]="50"
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
  </ngn-table>`,
})
export class Demo_Table_Virtual {
  protected readonly rows = exampleData.table(30000);
}
