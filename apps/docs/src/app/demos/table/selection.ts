import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableModule } from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnTableModule, NgnTemplate, JsonPipe],
  selector: 'ngn-demo-table-selection-single',
  template: `<ngn-table
      #table
      style="height: 400px"
      [rows]="rows"
      [fieldId]="'id'"
      selectionMode="single"
      [(selection)]="selectedIds"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')">ID</th>
          <th [ngnTableTh]="table.column('name')">Name</th>
          <th [ngnTableTh]="table.column('department')">Department</th>
          <th [ngnTableTh]="table.column('location')">Location</th>
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
    <p>Selected: {{ selectedIds() | json }}</p>`,
})
export class Demo_Table_Selection_Single {
  protected readonly rows = exampleData.table(100);
  protected readonly selectedIds = signal<string[]>([]);
}

@Component({
  imports: [NgnTableModule, NgnTemplate, JsonPipe],
  selector: 'ngn-demo-table-selection-multi',
  template: `<ngn-table
      #table
      style="height: 400px"
      [rows]="rows"
      [fieldId]="'id'"
      selectionMode="multi"
      [(selection)]="selectedIds"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')">ID</th>
          <th [ngnTableTh]="table.column('name')">Name</th>
          <th [ngnTableTh]="table.column('department')">Department</th>
          <th [ngnTableTh]="table.column('location')">Location</th>
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
    <p>Selected ({{ selectedIds().length }}): {{ selectedIds() | json }}</p>`,
})
export class Demo_Table_Selection_Multi {
  protected readonly rows = exampleData.table(100);
  protected readonly selectedIds = signal<string[]>([]);
}
