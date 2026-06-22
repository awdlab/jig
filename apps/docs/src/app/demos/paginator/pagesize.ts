import { Component } from '@angular/core';
import { NgnPaginator } from '@ngneers/controls/paginator';

@Component({
  selector: 'ngn-demo-paginator-pagesize',
  imports: [NgnPaginator],
  template: `
    <ngn-paginator [totalItems]="500" [pageSize]="20" [possiblePageSizes]="[10, 20, 30, 40]" />
  `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Pagesize {}
