import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import tablerArchive from '@iconify/icons-tabler/archive';
import tablerEdit from '@iconify/icons-tabler/edit';
import tablerMail from '@iconify/icons-tabler/mail';
import tablerTrash from '@iconify/icons-tabler/trash';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

import type { JigActionItem } from '@awdlab/jig/api';

@Component({
  imports: [JigTableModule, JigTemplate, CurrencyPipe],
  selector: 'jig-demo-table-showcase',
  template: `<jig-table
    #table
    [rows]="rows"
    [fieldId]="'id'"
    selectionMode="multi"
    [(selection)]="selectedIds"
    [paginator]="true"
    [resizable]="true"
    [reorderable]="true"
  >
    <ng-template #header>
      <tr jigTableHeadTr>
        <th jigTableSelectionColumn></th>
        <th
          [jigTableTh]="table.column('id')"
          [size]="'70px'"
          [jigTableStickyColumn]="'start'"
          [jigTableSortableColumn]
        >
          ID
        </th>
        <th
          [jigTableTh]="table.column('name')"
          [size]="'160px'"
          jigTableReorderableColumn
          [jigTableSortableColumn]
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'string'"
        >
          Name
        </th>
        <th
          [jigTableTh]="table.column('email')"
          [size]="'210px'"
          jigTableReorderableColumn
          [jigTableSortableColumn]
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'string'"
        >
          Email
        </th>
        <th
          [jigTableTh]="table.column('department')"
          [size]="'150px'"
          jigTableReorderableColumn
          [jigTableSortableColumn]
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'list'"
        >
          Department
        </th>
        <th
          [jigTableTh]="table.column('role')"
          [size]="'130px'"
          jigTableReorderableColumn
          [jigTableSortableColumn]
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'list'"
        >
          Role
        </th>
        <th
          [jigTableTh]="table.column('location')"
          [size]="'150px'"
          jigTableReorderableColumn
          [jigTableSortableColumn]
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'list'"
        >
          Location
        </th>
        <th
          [jigTableTh]="table.column('salary')"
          [size]="'130px'"
          jigTableReorderableColumn
          [jigTableSortableColumn]
          [jigTableFilterableColumn]
          [jigTableFilterableColumnType]="'number'"
        >
          Salary
        </th>
      </tr>
    </ng-template>
    <ng-template #body let-row [jigTemplate]="table.templateTypes.body">
      <tr [jigTableBodyTr]="row" [jigTableRowActions]="actionsFor(row.data)">
        <td jigTableSelectionColumn></td>
        <td jigTableTd>{{ row.data.id }}</td>
        <td jigTableTd>{{ row.data.name }}</td>
        <td jigTableTd>{{ row.data.email }}</td>
        <td jigTableTd>{{ row.data.department }}</td>
        <td jigTableTd>{{ row.data.role }}</td>
        <td jigTableTd>{{ row.data.location }}</td>
        <td jigTableTd>{{ row.data.salary | currency }}</td>
      </tr>
    </ng-template>
  </jig-table>`,
})
export class Demo_Table_Showcase {
  protected readonly rows = exampleData.richTable(200);
  protected readonly selectedIds = signal<number[]>([]);

  protected actionsFor(employee: { name: string }): JigActionItem[] {
    return [
      {
        id: 'edit',
        label: 'Edit',
        icon: tablerEdit,
        callback: () => alert(`Edit ${employee.name}`),
      },
      {
        id: 'mail',
        label: 'Send mail',
        icon: tablerMail,
        callback: () => alert(`Mail ${employee.name}`),
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: tablerArchive,
        callback: () => alert(`Archive ${employee.name}`),
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: tablerTrash,
        callback: () => alert(`Delete ${employee.name}`),
      },
    ];
  }
}
