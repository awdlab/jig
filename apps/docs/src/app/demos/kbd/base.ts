import { Component } from '@angular/core';
import { NgnKbd } from '@awdlab/jig/kbd';

@Component({
  selector: 'awd-demo-kbd-base',
  imports: [NgnKbd],
  template: `
    <div class="flex flex-wrap items-center gap-4 p-4">
      <awd-kbd shortcut="mod+shift+a" />
      <awd-kbd shortcut="ctrl+alt+delete" />
      <awd-kbd shortcut="escape" />
      <awd-kbd shortcut="mod+arrowup" />
      <awd-kbd shortcut="f2" />
    </div>
  `,
})
export class Demo_Kbd_Base {}
