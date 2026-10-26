import { Component } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule, JigTableReorderableColumn } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

import type { JigTableStorageConfig } from '@awdlab/jig/table';

@Component({
  imports: [JigTableModule, JigTemplate, JigTableReorderableColumn],
  selector: 'jig-demo-table-storage',
  host: { style: 'display: block; width: 100%' },
  template: `
    <p style="margin-bottom: 0.5rem; font-size: 0.875rem;">
      Sort, filter, resize, reorder or select — then reload the page. The state is restored from
      localStorage.
    </p>
    <jig-table
      #table
      style="height: 400px; width: 100%"
      [rows]="rows"
      [fieldId]="'id'"
      [resizable]="true"
      [reorderable]="true"
      [paginator]="true"
      selectionMode="multi"
      [storage]="storage"
    >
      <ng-template #header>
        <tr jigTableHeadTr>
          <th
            [jigTableTh]="table.column('id')"
            [jigTableSortableColumn]
            jigTableReorderableColumn
            [size]="'100px'"
          >
            ID
          </th>
          <th
            [jigTableTh]="table.column('name')"
            [jigTableSortableColumn]
            [jigTableFilterableColumn]
            [jigTableFilterableColumnType]="'string'"
            jigTableReorderableColumn
          >
            Name
          </th>
          <th
            [jigTableTh]="table.column('department')"
            [jigTableSortableColumn]
            jigTableReorderableColumn
          >
            Department
          </th>
          <th
            [jigTableTh]="table.column('location')"
            [jigTableSortableColumn]
            jigTableReorderableColumn
          >
            Location
          </th>
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
  `,
})
export class Demo_Table_Storage {
  protected readonly rows = exampleData.table(100);

  // Stable reference; key + optional JigStorageKind (defaults to 'localstorage').
  protected readonly storage: JigTableStorageConfig = {
    key: 'jig-demo-table-state',
    kind: 'localstorage',
  };
}
