import { Component } from '@angular/core';
import { NgnIcon } from '@ngneers/controls/icon';

@Component({
  imports: [NgnIcon],
  selector: 'ngn-icon-base',
  template: ` <ngn-icon [icon]="'fa fa-user'" /> `,
})
export class Demo_Icon_Base {}
