import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTemplate],
  selector: 'jig-demo-table-virtual',
  template: `<jig-table
    #table
    style="height: 400px"
    [rows]="rows"
    [fieldId]="'id'"
    [virtual]="true"
    [virtualPadding]="12"
    [rowHeight]="50"
  >
    <ng-template #header>
      <tr jigTableHeadTr>
        <th [jigTableTh]="table.column('id')">ID</th>
        <th [jigTableTh]="table.column('name')">Name</th>
        <th [jigTableTh]="table.column('department')">Department</th>
        <th [jigTableTh]="table.column('location')">Location</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
      <tr [jigTableBodyTr]="row">
        <td jigTableTd>{{ row.data.id }}</td>
        <td jigTableTd>{{ row.data.name }}</td>
        <td jigTableTd>{{ row.data.department }}</td>
        <td jigTableTd>{{ row.data.location }}</td>
      </tr>
    </ng-template>
  </jig-table>`,
})
export class Demo_Table_Virtual {
  protected readonly rows = exampleData.table(30000);
}
