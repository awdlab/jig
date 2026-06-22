import { Component, signal } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnSelectButton } from '@ngneers/controls/select-button';
import { NgnSwitch } from '@ngneers/controls/switch';
import { NgnTableModule } from '@ngneers/controls/table';
type TableResizeMode = 'adjacent' | 'proportional' | 'push';

import { exampleData } from '../../helper/data';

@Component({
  imports: [NgnTableModule, NgnTemplate, NgnSelectButton, NgnSwitch],
  selector: 'ngn-demo-table-resizable',
  host: { style: 'display: block; width: 100%' },
  template: ` <div
      style="margin-bottom: 8px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;"
    >
      <ngn-select-button [options]="modeOptions" [(value)]="resizeMode" />
      @if (resizeMode() === 'proportional') {
        <label
          [for]="switch.inputId()"
          style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
        >
          Lock resized
        </label>
        <ngn-switch #switch [(value)]="lockSizes" />
      }
    </div>
    <ngn-table
      #table
      style="height: 400px; width: 100%"
      [rows]="rows"
      [fieldId]="'id'"
      [resizable]="true"
      [resizeMode]="resizeMode()"
      [lockSizes]="lockSizes()"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [ngnTableTh]="table.column('id')" [size]="'100px'">ID</th>
          <th [ngnTableTh]="table.column('name')" [size]="'2fr'">Name</th>
          <th [ngnTableTh]="table.column('department')" [size]="'1fr'">Department</th>
          <th [ngnTableTh]="table.column('location')" [size]="'1fr'">Location</th>
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
    </ngn-table>`,
})
export class Demo_Table_Resizable {
  protected readonly rows = exampleData.table(100);
  protected readonly resizeMode = signal<TableResizeMode>('adjacent');
  protected readonly lockSizes = signal(true);
  protected readonly modeOptions = [
    { label: 'Adjacent', value: 'adjacent' as TableResizeMode },
    { label: 'Proportional', value: 'proportional' as TableResizeMode },
    { label: 'Push', value: 'push' as TableResizeMode },
  ] as const;
}
