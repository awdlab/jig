import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTemplate, JsonPipe],
  selector: 'jig-demo-table-selection-single',
  template: `<jig-table
      #table
      style="height: 400px"
      [rows]="rows"
      [fieldId]="'id'"
      selectionMode="single"
      [(selection)]="selectedIds"
    >
      <ng-template #header>
        <tr jigTableHeadTr>
          <th [jigTableTh]="table.column('id')">ID</th>
          <th [jigTableTh]="table.column('name')">Name</th>
          <th [jigTableTh]="table.column('department')">Department</th>
          <th [jigTableTh]="table.column('location')">Location</th>
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
    <p>Selected: {{ selectedIds() | json }}</p>`,
})
export class Demo_Table_Selection_Single {
  protected readonly rows = exampleData.table(100);
  protected readonly selectedIds = signal<string[]>([]);
}

@Component({
  imports: [JigTableModule, JigTemplate, JsonPipe],
  selector: 'jig-demo-table-selection-multi',
  template: `<jig-table
      #table
      style="height: 400px"
      [rows]="rows"
      [fieldId]="'id'"
      selectionMode="multi"
      [(selection)]="selectedIds"
    >
      <ng-template #header>
        <tr jigTableHeadTr>
          <th [jigTableTh]="table.column('id')">ID</th>
          <th [jigTableTh]="table.column('name')">Name</th>
          <th [jigTableTh]="table.column('department')">Department</th>
          <th [jigTableTh]="table.column('location')">Location</th>
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
    <p>Selected ({{ selectedIds().length }}): {{ selectedIds() | json }}</p>`,
})
export class Demo_Table_Selection_Multi {
  protected readonly rows = exampleData.table(100);
  protected readonly selectedIds = signal<string[]>([]);
}
