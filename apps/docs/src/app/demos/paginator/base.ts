import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgnPaginator } from '@ngneers/controls/paginator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-paginator-base',
  imports: [NgnPaginator],
  template: ` <ngn-paginator [totalItems]="300" /> `,
})
export class Demo_Paginator_Base {}
