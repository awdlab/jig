import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';

@Component({
  selector: 'jig-demo-button-base',
  imports: [JigButton],
  template: `<button jigButton (click)="onClick()">Click Me!!!</button>`,
})
export class Demo_Button_Base {
  protected onClick() {
    alert('Hello!');
  }
}
