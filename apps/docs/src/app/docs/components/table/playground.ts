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
          <tr jigTableHeadTr>
            <th jigTableSelectionColumn></th>
            <th [jigTableTh]="ref.column('id')" [jigTableSortableColumn]>ID</th>
            <th
              [jigTableTh]="ref.column('name')"
              [jigTableSortableColumn]
              [jigTableFilterableColumn]
              [jigTableFilterableColumnType]="'string'"
              jigTableReorderableColumn
            >
              Name
            </th>
            <th
              [jigTableTh]="ref.column('email')"
              [jigTableSortableColumn]
              jigTableReorderableColumn
            >
              Email
            </th>
            <th
              [jigTableTh]="ref.column('department')"
              [jigTableSortableColumn]
              [jigTableFilterableColumn]
              [jigTableFilterableColumnType]="'list'"
              jigTableReorderableColumn
            >
              Department
            </th>
            <th
              [jigTableTh]="ref.column('role')"
              [jigTableSortableColumn]
              [jigTableFilterableColumn]
              [jigTableFilterableColumnType]="'list'"
              jigTableReorderableColumn
            >
              Role
            </th>
            <th
              [jigTableTh]="ref.column('location')"
              [jigTableSortableColumn]
              [jigTableFilterableColumn]
              [jigTableFilterableColumnType]="'list'"
              jigTableReorderableColumn
            >
              Location
            </th>
            <th [jigTableTh]="ref.column('salary')" [jigTableSortableColumn]>Salary</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [jigTemplate]="ref.templateTypes.body">
          <tr [jigTableBodyTr]="row">
            <td jigTableSelectionColumn></td>
            <td jigTableTd>{{ row.data.id }}</td>
            <td jigTableTd>{{ row.data.name }}</td>
            <td jigTableTd>{{ row.data.email }}</td>
            <td jigTableTd>{{ row.data.department }}</td>
            <td jigTableTd>{{ row.data.role }}</td>
            <td jigTableTd>{{ row.data.location }}</td>
            <td jigTableTd>
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
