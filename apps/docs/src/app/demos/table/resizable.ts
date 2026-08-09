import { Component, signal } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigSelectButton } from '@awdlab/jig/select-button';
import { JigSwitch } from '@awdlab/jig/switch';
import { JigTableModule } from '@awdlab/jig/table';
type TableResizeMode = 'adjacent' | 'proportional' | 'push';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTemplate, JigSelectButton, JigSwitch],
  selector: 'jig-demo-table-resizable',
  host: { style: 'display: block; width: 100%' },
  template: ` <div
      style="margin-bottom: 8px; display: flex; gap: 16px; align-items: center; flex-wrap: wrap;"
    >
      <jig-select-button [options]="modeOptions" [(value)]="resizeMode" />
      @if (resizeMode() === 'proportional') {
        <label
          [for]="switch.inputId()"
          style="display: flex; align-items: center; gap: 8px; font-size: 14px;"
        >
          Lock resized
        </label>
        <jig-switch #switch [(value)]="lockSizes" />
      }
    </div>
    <jig-table
      #table
      style="height: 400px; width: 100%"
      [rows]="rows"
      [fieldId]="'id'"
      [resizable]="true"
      [resizeMode]="resizeMode()"
      [lockSizes]="lockSizes()"
    >
      <ng-template #header>
        <tr jigTableHeadTr>
          <th [jigTableTh]="table.column('id')" [size]="'100px'">ID</th>
          <th [jigTableTh]="table.column('name')" [size]="'2fr'">Name</th>
          <th [jigTableTh]="table.column('department')" [size]="'1fr'">Department</th>
          <th [jigTableTh]="table.column('location')" [size]="'1fr'">Location</th>
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
    </jig-table>`,
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
