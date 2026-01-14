import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnSpinner } from '@ngneers/controls/spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-demo-spinner-base',
  imports: [NgnSpinner],
  template: ` <ngn-spinner [color]="'primary'" /> `,
})
export class Demo_Spinner_Base {}
