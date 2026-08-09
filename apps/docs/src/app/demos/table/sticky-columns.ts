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
        <tr jigTableHeadTr>
          <th
            [jigTableTh]="table.column('id')"
            [jigTableStickyColumn]="'start'"
            jigTableReorderableColumn
            [size]="'80px'"
          >
            ID
          </th>
          <th
            [jigTableTh]="table.column('name')"
            [jigTableStickyColumn]="'start'"
            jigTableReorderableColumn
            [size]="'160px'"
          >
            Name
          </th>
          <th [jigTableTh]="table.column('email')" jigTableReorderableColumn [size]="'220px'">
            Email
          </th>
          <th [jigTableTh]="table.column('department')" jigTableReorderableColumn [size]="'150px'">
            Department
          </th>
          <th [jigTableTh]="table.column('role')" jigTableReorderableColumn [size]="'130px'">
            Role
          </th>
          <th [jigTableTh]="table.column('location')" jigTableReorderableColumn [size]="'150px'">
            Location
          </th>
          <th
            [jigTableTh]="table.column('salary')"
            [jigTableStickyColumn]="'end'"
            jigTableReorderableColumn
            [size]="'120px'"
          >
            Salary
          </th>
        </tr>
      </ng-template>
      <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
        <tr [jigTableBodyTr]="row">
          <td jigTableTd>{{ row.data.id }}</td>
          <td jigTableTd>{{ row.data.name }}</td>
          <td jigTableTd>{{ row.data.email }}</td>
          <td jigTableTd>{{ row.data.department }}</td>
          <td jigTableTd>{{ row.data.role }}</td>
          <td jigTableTd>{{ row.data.location }}</td>
          <td jigTableTd>{{ row.data.salary | currency }}</td>
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
