import { Component, viewChild } from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import {
  JigTableModule,
  JigTableSortableColumn,
  JigTableFilterableColumn,
  JigTableReorderableColumn,
  JigTableSelectionColumn,
} from '@awdlab/jig/table';

import { exampleData } from '../../../helper/data';
import { JigDocsPlayground } from '../../../utils/playground/playground';

import type { JigTable } from '@awdlab/jig/table';

type RowType = ReturnType<typeof exampleData.richTable>[number];

@Component({
  selector: 'jig-docs-table-playground',
  imports: [
    JigTableModule,
    JigTemplate,
    JigDocsPlayground,
    JigTableSortableColumn,
    JigTableFilterableColumn,
    JigTableReorderableColumn,
    JigTableSelectionColumn,
  ],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigTable', component: component() }]">
      <jig-table
        #ref
        style="height: 400px; max-height: 100%; width: 100%"
        class="flex-1"
        [rows]="rows"
        [fieldId]="'id'"
        [resizable]="true"
        [reorderable]="true"
        [selectionMode]="'multi'"
      >
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th ngnTableSelectionColumn></th>
            <th [ngnTableTh]="ref.column('id')" [ngnTableSortableColumn]>ID</th>
            <th
              [ngnTableTh]="ref.column('name')"
              [ngnTableSortableColumn]
              [ngnTableFilterableColumn]
              [ngnTableFilterableColumnType]="'string'"
              ngnTableReorderableColumn
            >
              Name
            </th>
            <th
              [ngnTableTh]="ref.column('email')"
              [ngnTableSortableColumn]
              ngnTableReorderableColumn
            >
              Email
            </th>
            <th
              [ngnTableTh]="ref.column('department')"
              [ngnTableSortableColumn]
              [ngnTableFilterableColumn]
              [ngnTableFilterableColumnType]="'list'"
              ngnTableReorderableColumn
            >
              Department
            </th>
            <th
              [ngnTableTh]="ref.column('role')"
              [ngnTableSortableColumn]
              [ngnTableFilterableColumn]
              [ngnTableFilterableColumnType]="'list'"
              ngnTableReorderableColumn
            >
              Role
            </th>
            <th
              [ngnTableTh]="ref.column('location')"
              [ngnTableSortableColumn]
              [ngnTableFilterableColumn]
              [ngnTableFilterableColumnType]="'list'"
              ngnTableReorderableColumn
            >
              Location
            </th>
            <th [ngnTableTh]="ref.column('salary')" [ngnTableSortableColumn]>Salary</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="ref.templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableSelectionColumn></td>
            <td ngnTableTd>{{ row.data.id }}</td>
            <td ngnTableTd>{{ row.data.name }}</td>
            <td ngnTableTd>{{ row.data.email }}</td>
            <td ngnTableTd>{{ row.data.department }}</td>
            <td ngnTableTd>{{ row.data.role }}</td>
            <td ngnTableTd>{{ row.data.location }}</td>
            <td ngnTableTd>
              {{ '$' + row.data.salary.toLocaleString() }}
            </td>
          </tr>
        </ng-template>
      </jig-table>
    </jig-docs-playground>
  `,
})
export class JigDocsTablePlayground {
  protected readonly component = viewChild.required<JigTable<RowType, 'id'>>('ref');
  protected readonly rows = exampleData.richTable(50);
}
