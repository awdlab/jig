import { Component } from '@angular/core';
import { AwdSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'jig-demo-spinner-base',
  imports: [AwdSpinner],
  template: ` <jig-spinner [color]="'primary'" /> `,
})
export class Demo_Spinner_Base {}
