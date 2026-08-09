import { Component } from '@angular/core';
import { JigPaginator } from '@awdlab/jig/paginator';

@Component({
  selector: 'jig-demo-paginator-pagesize',
  imports: [JigPaginator],
  template: `
    <jig-paginator [totalItems]="500" [pageSize]="20" [possiblePageSizes]="[10, 20, 30, 40]" />
  `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Pagesize {}
