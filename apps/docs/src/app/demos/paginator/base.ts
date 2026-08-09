import { Component } from '@angular/core';
import { JigPaginator } from '@awdlab/jig/paginator';

@Component({
  selector: 'jig-demo-paginator-base',
  imports: [JigPaginator],
  template: ` <jig-paginator [totalItems]="50" /> `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Base {}
