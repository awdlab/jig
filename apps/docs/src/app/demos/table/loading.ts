import { Component, signal } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigButton } from '@awdlab/jig/button';
import { JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

@Component({
  imports: [JigTableModule, JigTemplate, JigButton],
  selector: 'jig-demo-table-loading',
  template: `<button jigButton (click)="reload()">Reload</button>
    <jig-table #table style="height: 400px" [rows]="rows" [loading]="loading()" [fieldId]="'id'">
      <ng-template #header>
        <tr jigTableHeadTr>
          <th [jigTableTh]="table.column('id')">ID</th>
          <th [jigTableTh]="table.column('name')">Name</th>
          <th [jigTableTh]="table.column('department')">Department</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
        <tr [jigTableBodyTr]="row">
          <td jigTableTd>{{ row.data.id }}</td>
          <td jigTableTd>{{ row.data.name }}</td>
          <td jigTableTd>{{ row.data.department }}</td>
        </tr>
      </ng-template>
    </jig-table>`,
})
export class Demo_Table_Loading {
  protected readonly rows = exampleData.table(20);
  protected readonly loading = signal(false);

  protected reload() {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1500);
  }
}
