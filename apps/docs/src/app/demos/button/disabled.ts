import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  selector: 'ngn-demo-button-disabled',
  imports: [NgnButton],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <button ngnButton>Enabled</button>
      <button ngnButton disabled>Disabled</button>
    </div>
  `,
})
export class Demo_Button_Disabled {}
