import { Component } from '@angular/core';
import { NgnKbd } from '@ngneers/controls/kbd';

@Component({
  selector: 'ngn-demo-kbd-base',
  imports: [NgnKbd],
  template: `
    <div class="flex flex-wrap items-center gap-4 p-4">
      <ngn-kbd shortcut="mod+shift+a" />
      <ngn-kbd shortcut="ctrl+alt+delete" />
      <ngn-kbd shortcut="escape" />
      <ngn-kbd shortcut="mod+arrowup" />
      <ngn-kbd shortcut="f2" />
    </div>
  `,
})
export class Demo_Kbd_Base {}
