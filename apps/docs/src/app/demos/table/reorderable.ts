import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTemplate, JsonPipe],
  selector: 'jig-demo-table-reorderable',
  host: { style: 'display: block; width: 100%' },
  template: `
    <jig-table
      #table
      style="height: 400px; width: 100%"
      [rows]="rows"
      [fieldId]="'id'"
      [reorderable]="true"
      [(columnOrder)]="columnOrder"
    >
      <ng-template #header>
        <tr jigTableHeadTr>
          <th [jigTableTh]="table.column('id')" jigTableReorderableColumn>ID</th>
          <th [jigTableTh]="table.column('name')" jigTableReorderableColumn>Name</th>
          <th [jigTableTh]="table.column('department')" jigTableReorderableColumn>Department</th>
          <th [jigTableTh]="table.column('location')" jigTableReorderableColumn>Location</th>
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
    </jig-table>
    <p style="margin-top: 8px; font-size: 14px; color: #666;">
      Column order: {{ columnOrder() | json }}
    </p>
  `,
})
export class Demo_Table_Reorderable {
  protected readonly rows = exampleData.table(100);
  protected readonly columnOrder = signal<string[]>([]);
}
