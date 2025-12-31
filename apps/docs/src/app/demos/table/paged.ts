import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableModule } from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTableModule, NgnTemplate],
  selector: 'ngn-demo-table-paged',
  template: `<ngn-table #table [rows]="rows" [fieldId]="'id'" [paginator]="true">
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">Id</th>
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
  </ngn-table>`,
})
export class Demo_Table_Paged {
  protected readonly rows = exampleData.table(1000);
}
