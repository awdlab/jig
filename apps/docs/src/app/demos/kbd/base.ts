import { Component } from '@angular/core';
import { AwdKbd } from '@awdlab/jig/kbd';

@Component({
  selector: 'jig-demo-kbd-base',
  imports: [AwdKbd],
  template: `
    <div class="flex flex-wrap items-center gap-4 p-4">
      <jig-kbd shortcut="mod+shift+a" />
      <jig-kbd shortcut="ctrl+alt+delete" />
      <jig-kbd shortcut="escape" />
      <jig-kbd shortcut="mod+arrowup" />
      <jig-kbd shortcut="f2" />
    </div>
  `,
})
export class Demo_Kbd_Base {}
