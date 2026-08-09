import { Component } from '@angular/core';
import { NgnPaginator } from '@awdlab/jig/paginator';

@Component({
  selector: 'awd-demo-paginator-overflow',
  imports: [NgnPaginator],
  template: ` <awd-paginator [totalItems]="4500" /> `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Overflow {}
