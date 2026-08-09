import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule, JigTableSortableColumn } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTableSortableColumn, JigTemplate],
  selector: 'jig-demo-table-sorting',
  template: `<jig-table #table style="height: 400px" [rows]="rows" [fieldId]="'id'">
    <ng-template #header>
      <tr jigTableHeadTr>
        <th [jigTableTh]="table.column('id')" [jigTableSortableColumn]>ID</th>
        <th [jigTableTh]="table.column('name')" [jigTableSortableColumn]>Name</th>
        <th [jigTableTh]="table.column('department')" [jigTableSortableColumn]>Department</th>
        <th [jigTableTh]="table.column('location')" [jigTableSortableColumn]>Location</th>
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
export class Demo_Table_Sorting {
  protected readonly rows = exampleData.table(100);
}
