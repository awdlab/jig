import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnCalendar } from '@ngneers/controls/calendar';
import {
  NgnTableFilterableColumn,
  NgnTableModule,
  NgnTableSortableColumn,
} from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgnTableModule,
    NgnTableSortableColumn,
    NgnTableFilterableColumn,
    NgnTemplate,
    NgnCalendar,
  ],
  selector: 'ngn-demo-table-base',
  template: `<ngn-table
    #table
    style="height: 400px"
    [rows]="rows"
    [fieldId]="'id'"
    [virtual]="true"
    [striped]="true"
    [rowHeight]="50"
  >
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th
          [ngnTableTh]="table.column('id')"
          [ngnTableSortableColumn]
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'string'"
        >
          Id
        </th>
        <th [ngnTableTh]="table.column('name')" [ngnTableSortableColumn]>Name</th>
        <th
          [ngnTableTh]="table.column('department')"
          [ngnTableSortableColumn]
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'list'"
        >
          Department
        </th>
        <th
          [ngnTableTh]="table.column('location')"
          [ngnTableSortableColumn]
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'list'"
        >
          Location
        </th>
        <th ngnTableTh>Debug</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row">
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd>{{ row.data.name }}</td>
        <td ngnTableTd>{{ row.data.department }}</td>
        <td ngnTableTd>{{ row.data.location }}</td>
        <td ngnTableTd class="flex items-center">
          @defer (on idle) {
            <ngn-calendar />
          }
        </td>
      </tr>
    </ng-template>
  </ngn-table>`,
})
export class Demo_Table_Base {
  protected readonly rows = exampleData.table(30000);
}
