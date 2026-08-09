import { Component } from '@angular/core';
import { AwdPaginator } from '@awdlab/jig/paginator';

@Component({
  selector: 'jig-demo-paginator-base',
  imports: [AwdPaginator],
  template: ` <jig-paginator [totalItems]="50" /> `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Base {}
