import { Component } from '@angular/core';
import { NgnPaginator } from '@ngneers/controls/paginator';

@Component({
  selector: 'ngn-demo-paginator-base',
  imports: [NgnPaginator],
  template: ` <ngn-paginator [totalItems]="50" /> `,
  host: { class: 'flex-1' },
})
export class Demo_Paginator_Base {}
