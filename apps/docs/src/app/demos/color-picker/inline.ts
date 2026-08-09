import { Component, signal } from '@angular/core';
import { NgnColorPicker } from '@awdlab/jig/color-picker';

@Component({
  selector: 'awd-demo-color-picker-inline',
  imports: [NgnColorPicker],
  template: `<awd-color-picker
    [inline]="true"
    [value]="value()"
    (valueChange)="value.set($event)"
  />`,
})
export class Demo_ColorPicker_Inline {
  protected readonly value = signal('#10b981');
}
