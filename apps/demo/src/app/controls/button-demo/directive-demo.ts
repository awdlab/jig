import { Component } from '@angular/core';
import { ButtonDirective } from '@ngneers/controls/button';

@Component({
  imports: [ButtonDirective],
  template: `<button ngnButton>Click Me!!!</button>`,
})
export class Button_Directive_Component {}
