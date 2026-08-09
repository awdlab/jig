import { CurrencyPipe, JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTemplate, CurrencyPipe, JsonPipe],
  selector: 'jig-demo-table-sticky-columns',
  host: { style: 'display: block; width: 100%' },
  template: `
    <jig-table
      #table
      style="height: 400px; width: 100%; max-width: 800px"
      [rows]="rows"
      [fieldId]="'id'"
      [resizable]="true"
      [reorderable]="true"
      [(columnOrder)]="columnOrder"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th
            [ngnTableTh]="table.column('id')"
            [ngnTableStickyColumn]="'start'"
            ngnTableReorderableColumn
            [size]="'80px'"
          >
            ID
          </th>
          <th
            [ngnTableTh]="table.column('name')"
            [ngnTableStickyColumn]="'start'"
            ngnTableReorderableColumn
            [size]="'160px'"
          >
            Name
          </th>
          <th [ngnTableTh]="table.column('email')" ngnTableReorderableColumn [size]="'220px'">
            Email
          </th>
          <th [ngnTableTh]="table.column('department')" ngnTableReorderableColumn [size]="'150px'">
            Department
          </th>
          <th [ngnTableTh]="table.column('role')" ngnTableReorderableColumn [size]="'130px'">
            Role
          </th>
          <th [ngnTableTh]="table.column('location')" ngnTableReorderableColumn [size]="'150px'">
            Location
          </th>
          <th
            [ngnTableTh]="table.column('salary')"
            [ngnTableStickyColumn]="'end'"
            ngnTableReorderableColumn
            [size]="'120px'"
          >
            Salary
          </th>
        </tr>
      </ng-template>
      <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
        <tr [ngnTableBodyTr]="row">
          <td ngnTableTd>{{ row.data.id }}</td>
          <td ngnTableTd>{{ row.data.name }}</td>
          <td ngnTableTd>{{ row.data.email }}</td>
          <td ngnTableTd>{{ row.data.department }}</td>
          <td ngnTableTd>{{ row.data.role }}</td>
          <td ngnTableTd>{{ row.data.location }}</td>
          <td ngnTableTd>{{ row.data.salary | currency }}</td>
        </tr>
      </ng-template>
    </jig-table>
    <p style="margin-top: 8px; font-size: 14px; color: #666;">
      Column order: {{ columnOrder() | json }}
    </p>
  `,
})
export class Demo_Table_StickyColumns {
  protected readonly rows = exampleData.richTable(50);
  protected readonly columnOrder = signal<string[]>([]);
}
