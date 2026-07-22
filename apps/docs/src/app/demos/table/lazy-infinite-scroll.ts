import { Component } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableModule } from '@ngneers/controls/table';

import { fetchPage, type Person } from './fake-data-service';

import type { TableDataSource } from '@ngneers/controls/table';

@Component({
  imports: [NgnTableModule, NgnTemplate],
  selector: 'ngn-demo-table-lazy-infinite-scroll',
  template: `<ngn-table
    #table
    style="height: 400px"
    [fieldId]="'id'"
    [virtual]="true"
    [rowHeight]="44"
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
export class Demo_Table_LazyInfiniteScroll {
  protected readonly load: TableDataSource<Person> = req =>
    fetchPage(req.pagination.slice.skip, req.pagination.slice.take);
}
