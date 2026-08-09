import { Component } from '@angular/core';
import { NgnSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'awd-demo-spinner-base',
  imports: [NgnSpinner],
  template: ` <awd-spinner [color]="'primary'" /> `,
})
export class Demo_Spinner_Base {}
