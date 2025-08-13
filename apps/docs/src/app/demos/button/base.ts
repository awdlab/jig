import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  imports: [NgnButton],
  template: `<button ngnButton (click)="onClick()">Click Me!!!</button>`,
})
export class Demo_Button_Base {
  protected onClick() {
    alert('Hello!');
  }
}
