import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnTemplate } from '@ngneers/controls/api/ng';
import { NgnTableModule } from '@ngneers/controls/table';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTableModule, NgnTemplate],
  selector: 'ngn-demo-table-sticky',
  host: { style: 'display: block; width: 100%' },
  template: `
    <ngn-table
      #table
      style="height: 400px; width: 100%"
      [rows]="rows"
      [fieldId]="'id'"
      [selectionMode]="'multi'"
    >
      <ng-template #header>
        <tr ngnTableHeadTr>
          <th [width]="200" [ngnTableTh]="'name'" ngnTableStickyColumn="left">Name</th>
          <th [width]="200" [ngnTableTh]="'email'">Email</th>
          <th [width]="200" [ngnTableTh]="'department'">Department</th>
          <th [width]="200" [ngnTableTh]="'role'">Role</th>
          <th [width]="200" [ngnTableTh]="'location'">Location</th>
          <th [width]="200" [ngnTableTh]="'salary'">Salary</th>
          <th [width]="200" [ngnTableTh]="'startDate'">Start Date</th>
          <th [width]="200" [ngnTableTh]="'actions'" ngnTableStickyColumn="right">Actions</th>
        </tr>
      </ng-template>
      <ng-template #body let-row [ngnTemplate]="table.templateTypes.body">
        <tr [ngnTableBodyTr]="row">
          <td ngnTableTd ngnTableStickyColumn="left">{{ row.data.name }}</td>
          <td ngnTableTd>{{ row.data.email }}</td>
          <td ngnTableTd>{{ row.data.department }}</td>
          <td ngnTableTd>{{ row.data.role }}</td>
          <td ngnTableTd>{{ row.data.location }}</td>
          <td ngnTableTd>{{ row.data.salary }}</td>
          <td ngnTableTd>{{ row.data.startDate }}</td>
          <td ngnTableTd ngnTableStickyColumn="right">Edit | Delete</td>
        </tr>
      </ng-template>
    </ngn-table>
  `,
})
export class Demo_Table_Sticky {
  protected readonly rows = generateStickyDemoData(50);
}

function generateStickyDemoData(count: number) {
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const locations = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'];
  const roles = ['Manager', 'Senior', 'Junior', 'Lead', 'Director', 'Intern'];
  const firstNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];

  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length]!;
    const last = lastNames[i % lastNames.length]!;
    return {
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      department: departments[i % departments.length]!,
      role: roles[i % roles.length]!,
      location: locations[i % locations.length]!,
      salary: `$${(50000 + i * 1000).toLocaleString()}`,
      startDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
    };
  });
}
