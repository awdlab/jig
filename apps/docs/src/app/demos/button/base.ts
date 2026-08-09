import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';

@Component({
  selector: 'awd-demo-button-base',
  imports: [NgnButton],
  template: `<button ngnButton (click)="onClick()">Click Me!!!</button>`,
})
export class Demo_Button_Base {
  protected onClick() {
    alert('Hello!');
  }
}
