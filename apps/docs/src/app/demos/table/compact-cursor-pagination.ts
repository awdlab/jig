import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableModule } from '@ngneers/controls/table';

import { fetchCursor, type Person } from './fake-data-service';

import type { TableDataSource } from '@ngneers/controls/table';

@Component({
  imports: [NgnTableModule, NgnTemplate],
  selector: 'ngn-demo-table-compact-cursor-pagination',
  template: `<ngn-table
    #table
    style="height: 400px"
    [fieldId]="'id'"
    [paginator]="true"
    [dataSource]="load"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
        <th [ngnTableTh]="table.column('email')">Email</th>
        <th [ngnTableTh]="table.column('age')">Age</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd>{{ row.data.name }}</td>
        <td ngnTableTd>{{ row.data.email }}</td>
        <td ngnTableTd>{{ row.data.age }}</td>
      </tr>
    </ng-template>
  </ngn-table>`,
})
export class Demo_Table_CompactCursorPagination {
  protected readonly load: TableDataSource<Person> = req =>
    fetchCursor(req.cursor as number | undefined, req.pagination.slice.take);
}
