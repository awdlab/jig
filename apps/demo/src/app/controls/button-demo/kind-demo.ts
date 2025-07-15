import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';

@Component({
  imports: [NgnButton],
  template: `
    <button ngnButton [kind]="'primary'">Primary</button>
    <button ngnButton [kind]="'secondary'">Secondary</button>
    <button ngnButton [kind]="'text'">Text</button>
    <button ngnButton [kind]="'link'">Link</button>
    <button ngnButton [kind]="'icon'">❗</button>
  `,
})
export class Button_Kind_Component {}
