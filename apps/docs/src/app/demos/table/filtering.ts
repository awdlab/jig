import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableFilterableColumn, NgnTableModule } from '@ngneers/controls/table';

import { exampleData } from '../../helper/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTableModule, NgnTableFilterableColumn, NgnTemplate],
  selector: 'ngn-demo-table-filtering',
  template: `<ngn-table #table style="height: 400px" [rows]="rows" [fieldId]="'id'">
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th
          [ngnTableTh]="table.column('id')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'string'"
        >
          Id
        </th>
        <th
          [ngnTableTh]="table.column('name')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'string'"
        >
          Name
        </th>
        <th
          [ngnTableTh]="table.column('department')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'list'"
        >
          Department
        </th>
        <th
          [ngnTableTh]="table.column('location')"
          [ngnTableFilterableColumn]
          [ngnTableFilterableColumnType]="'list'"
        >
          Location
        </th>
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
export class Demo_Table_Filtering {
  protected readonly rows = exampleData.table(100);
}
