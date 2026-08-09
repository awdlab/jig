import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule } from '@awdlab/jig/table';

import { fetchCursor, type Person } from './fake-data-service';

import type { TableDataSource } from '@awdlab/jig/table';

@Component({
  imports: [JigTableModule, JigTemplate],
  selector: 'jig-demo-table-compact-cursor-pagination',
  template: `<jig-table
    #table
    style="height: 400px"
    [fieldId]="'id'"
    [paginator]="true"
    [dataSource]="load"
  >
    <ng-template #header>
      <tr jigTableHeadTr>
        <th [jigTableTh]="table.column('id')">ID</th>
        <th [jigTableTh]="table.column('name')">Name</th>
        <th [jigTableTh]="table.column('email')">Email</th>
        <th [jigTableTh]="table.column('age')">Age</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
      <tr [jigTableBodyTr]="row">
        <td jigTableTd>{{ row.data.id }}</td>
        <td jigTableTd>{{ row.data.name }}</td>
        <td jigTableTd>{{ row.data.email }}</td>
        <td jigTableTd>{{ row.data.age }}</td>
      </tr>
    </ng-template>
  </jig-table>`,
})
export class Demo_Table_CompactCursorPagination {
  protected readonly load: TableDataSource<Person> = req =>
    fetchCursor(req.cursor as number | undefined, req.pagination.slice.take);
}
