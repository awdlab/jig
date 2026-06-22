import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableModule } from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnTableModule, NgnTemplate, JsonPipe],
  selector: 'ngn-demo-table-reorderable',
  host: { style: 'display: block; width: 100%' },
  template: `
    <ngn-table
      #table
      style="height: 400px; width: 100%"
      [rows]="rows"
      [fieldId]="'id'"
      [reorderable]="true"
      [(columnOrder)]="columnOrder"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')" ngnTableReorderableColumn>ID</th>
          <th [ngnTableTh]="table.column('name')" ngnTableReorderableColumn>Name</th>
          <th [ngnTableTh]="table.column('department')" ngnTableReorderableColumn>Department</th>
          <th [ngnTableTh]="table.column('location')" ngnTableReorderableColumn>Location</th>
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
    </ngn-table>
    <p style="margin-top: 8px; font-size: 14px; color: #666;">
      Column order: {{ columnOrder() | json }}
    </p>
  `,
})
export class Demo_Table_Reorderable {
  protected readonly rows = exampleData.table(100);
  protected readonly columnOrder = signal<string[]>([]);
}
