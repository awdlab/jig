import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableFilterableColumn, JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTableFilterableColumn, JigTemplate],
  selector: 'jig-demo-table-filtering',
  template: `<jig-table #table style="height: 400px" [rows]="rows" [fieldId]="'id'">
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th
          [ngnTableTh]="table.column('id')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'string'"
        >
          ID
        </th>
        <th
          [ngnTableTh]="table.column('name')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'string'"
        >
          Name
        </th>
        <th
          [ngnTableTh]="table.column('department')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'list'"
        >
          Department
        </th>
        <th
          [ngnTableTh]="table.column('location')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'list'"
        >
          Location
        </th>
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
export class Demo_Table_Filtering {
  protected readonly rows = exampleData.table(100);
}
