import { Component, effect, signal } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableFilterableColumn, JigTableModule } from '@awdlab/jig/table';

import { fetchFiltered, type Person } from './fake-data-service';

import type { JigFilterConfig } from '@awdlab/jig/filter';

@Component({
  imports: [JigTableModule, JigTableFilterableColumn, JigTemplate],
  selector: 'jig-demo-table-server-filtering',
  template: `<jig-table
    #table
    style="height: 400px"
    [rows]="rows()"
    [fieldId]="'id'"
    [filterLocally]="false"
    [(filters)]="filters"
  >
    <ng-template #header>
      <tr jigTableHeadTr>
        <th [jigTableTh]="table.column('id')">ID</th>
        <th
          [jigTableTh]="table.column('name')"
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'string'"
        >
          Name
        </th>
        <th [jigTableTh]="table.column('email')">Email</th>
        <th
          [jigTableTh]="table.column('age')"
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'number'"
        >
          Age
        </th>
      </tr>
    </ng-template>
    <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
      <tr [jigTableBodyTr]="row">
        <td jigTableTd>{{ row.data.id }}</td>
        <td jigTableTd>{{ row.data.name }}</td>
        <td jigTableTd>{{ row.data.email }}</td>
        <td jigTableTd>{{ row.data.age }}</td>
      </tr>
    </ng-template>
  </jig-table>`,
})
export class Demo_Table_ServerFiltering {
  protected readonly filters = signal<Record<string, JigFilterConfig> | null>(null);
  protected readonly rows = signal<readonly Person[]>([]);

  constructor() {
    effect(() => {
      const filters = this.filters();
      void fetchFiltered(filters).then(rows => {
        if (this.filters() === filters) this.rows.set(rows);
      });
    });
  }
}
