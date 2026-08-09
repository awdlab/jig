import { Component } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';

@Component({
  selector: 'jig-demo-button-base',
  imports: [AwdButton],
  template: `<button ngnButton (click)="onClick()">Click Me!!!</button>`,
})
export class Demo_Button_Base {
  protected onClick() {
    alert('Hello!');
  }
}
