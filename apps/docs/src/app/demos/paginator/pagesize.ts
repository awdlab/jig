import { Component } from '@angular/core';
import { NgnPaginator } from '@awdlab/jig/paginator';

@Component({
  selector: 'awd-demo-paginator-pagesize',
  imports: [NgnPaginator],
  template: `
    <awd-paginator [totalItems]="500" [pageSize]="20" [possiblePageSizes]="[10, 20, 30, 40]" />
  `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Pagesize {}
