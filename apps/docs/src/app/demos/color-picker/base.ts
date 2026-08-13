import { Component, signal } from '@angular/core';
import { JigColorPicker } from '@awdlab/jig/color-picker';

@Component({
  selector: 'jig-demo-color-picker-base',
  imports: [JigColorPicker],
  template: `
    <jig-color-picker [value]="value()" (valueChange)="value.set($event)" />
    <span class="ms-3 inline-block min-w-[13ch] font-mono">{{ value() }}</span>
  `,
  host: { class: 'flex items-center' },
})
export class Demo_ColorPicker_Base {
  protected readonly value = signal('#3b82f6');
}
