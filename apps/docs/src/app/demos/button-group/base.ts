import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnButtonGroup } from '@ngneers/controls/button-group';

@Component({
  imports: [NgnButton, NgnButtonGroup],
  template: `<ngn-button-group>
    <button ngnButton [kind]="'primary'">Button A</button>
    <button ngnButton [kind]="'primary'">Button B</button>
    <button ngnButton [kind]="'primary'">Button C123</button>
  </ngn-button-group>`,
})
export class Demo_Button_Group_Base {}
