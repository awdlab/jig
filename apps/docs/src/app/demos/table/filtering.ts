import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableFilterableColumn, JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTableFilterableColumn, JigTemplate],
  selector: 'jig-demo-table-filtering',
  template: `<jig-table #table style="height: 400px" [rows]="rows" [fieldId]="'id'">
    <ng-template #header>
      <tr jigTableHeadTr>
        <th
          [jigTableTh]="table.column('id')"
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'string'"
        >
          ID
        </th>
        <th
          [jigTableTh]="table.column('name')"
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'string'"
        >
          Name
        </th>
        <th
          [jigTableTh]="table.column('department')"
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'list'"
        >
          Department
        </th>
        <th
          [jigTableTh]="table.column('location')"
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'list'"
        >
          Location
        </th>
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
export class Demo_Table_Filtering {
  protected readonly rows = exampleData.table(100);
}
