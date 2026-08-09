import { Component } from '@angular/core';
import { NgnPaginator } from '@awdlab/jig/paginator';

@Component({
  selector: 'awd-demo-paginator-base',
  imports: [NgnPaginator],
  template: ` <awd-paginator [totalItems]="50" /> `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Base {}
