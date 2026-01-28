import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTable, NgnTableModule } from '@ngneers/controls/table';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

type RowType = { id: string; name: string };

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTableModule, NgnTemplate, NgnDocsPlayground],
  template: `
    <ngn-docs-playground componentName="NgnTable" [component]="component()">
      <ngn-table #ref style="height: 200px" [rows]="rows" [fieldId]="'id'">
        <ng-template #header>
          <tr ngnTableHeadTr>
            <th [ngnTableTh]="component().column('id')">ID</th>
            <th [ngnTableTh]="component().column('name')">Name</th>
          </tr>
        </ng-template>
        <ng-template #body let-row [ngnTemplate]="component().templateTypes.body">
          <tr [ngnTableBodyTr]="row">
            <td ngnTableTd>{{ row.data.id }}</td>
            <td ngnTableTd>{{ row.data.name }}</td>
          </tr>
        </ng-template>
      </ngn-table>
    </ngn-docs-playground>
  `,
})
export class NgnDocsTablePlayground {
  protected readonly component = viewChild.required<NgnTable<RowType, 'id'>>('ref');
  protected readonly rows: RowType[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];
}
