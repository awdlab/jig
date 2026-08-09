import { Component } from '@angular/core';
import tablerArchive from '@iconify/icons-tabler/archive';
import tablerCopy from '@iconify/icons-tabler/copy';
import tablerDots from '@iconify/icons-tabler/dots';
import tablerEdit from '@iconify/icons-tabler/edit';
import tablerShare from '@iconify/icons-tabler/share';
import tablerTrash from '@iconify/icons-tabler/trash';
import { AwdTemplate } from '@awdlab/jig/api/ng';
import { AwdTableModule } from '@awdlab/jig/table';

import { exampleData } from '../../helper/data';

import type { JigActionItem } from '@awdlab/jig/api';

@Component({
  imports: [AwdTableModule, AwdTemplate],
  selector: 'jig-demo-table-row-actions',
  template: `<jig-table #table style="height: 400px" [rows]="rows" [fieldId]="'id'">
    <ng-template #header>
      <tr ngnTableHeadTr>
        <th [ngnTableTh]="table.column('id')">ID</th>
        <th [ngnTableTh]="table.column('name')">Name</th>
        <th [ngnTableTh]="table.column('department')">Department</th>
        <th [ngnTableTh]="table.column('location')">Location</th>
      </tr>
    </ng-template>
    <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
      <tr [ngnTableBodyTr]="row" [ngnTableRowActions]="actionsFor(row)">
        <td ngnTableTd>{{ row.data.id }}</td>
        <td ngnTableTd>{{ row.data.name }}</td>
        <td ngnTableTd>{{ row.data.department }}</td>
        <td ngnTableTd>{{ row.data.location }}</td>
      </tr>
    </ng-template>
  </jig-table>`,
})
export class Demo_Table_RowActions {
  protected readonly rows = exampleData.table(100);

  protected actionsFor(row: { index: number; data: { name: string } }): JigActionItem[] {
    const name = row.data.name;
    const actions: JigActionItem[] = [
      { id: 'edit', label: 'Edit', icon: tablerEdit, callback: () => alert(`Edit ${name}`) },
      { id: 'delete', label: 'Delete', icon: tablerTrash, callback: () => alert(`Delete ${name}`) },
    ];

    // Every odd row (1-based) gets an extra "…" action whose children open in a
    // submenu — demonstrating nested actions in both the inline bar and the
    // right-click context menu.
    if (row.index % 2 === 0) {
      actions.push({
        id: 'more',
        label: 'More',
        icon: tablerDots,
        children: [
          {
            id: 'duplicate',
            label: 'Duplicate',
            icon: tablerCopy,
            callback: () => alert(`Duplicate ${name}`),
          },
          {
            id: 'share',
            label: 'Share',
            icon: tablerShare,
            callback: () => alert(`Share ${name}`),
          },
          {
            id: 'archive',
            label: 'Archive',
            icon: tablerArchive,
            callback: () => alert(`Archive ${name}`),
          },
        ],
      });
    }

    return actions;
  }
}
