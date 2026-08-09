import { Component } from '@angular/core';
import { AwdPaginator } from '@awdlab/jig/paginator';

@Component({
  selector: 'jig-demo-paginator-pagesize',
  imports: [AwdPaginator],
  template: `
    <jig-paginator [totalItems]="500" [pageSize]="20" [possiblePageSizes]="[10, 20, 30, 40]" />
  `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Pagesize {}
