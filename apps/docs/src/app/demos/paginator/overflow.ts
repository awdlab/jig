import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgnPaginator } from '@ngneers/controls/paginator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-paginator-overflow',
  imports: [NgnPaginator],
  template: ` <ngn-paginator [totalItems]="4500" /> `,
})
export class Demo_Paginator_Overflow {}
