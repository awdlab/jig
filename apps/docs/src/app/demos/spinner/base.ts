import { Component } from '@angular/core';
import { JigSpinner } from '@awdlab/jig/spinner';

@Component({
  selector: 'jig-demo-spinner-base',
  imports: [JigSpinner],
  template: ` <jig-spinner [color]="'primary'" /> `,
})
export class Demo_Spinner_Base {}
