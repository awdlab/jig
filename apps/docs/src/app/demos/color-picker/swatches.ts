import { Component, signal } from '@angular/core';
import { NgnColorPicker } from '@awdlab/jig/color-picker';

@Component({
  selector: 'awd-demo-color-picker-swatches',
  imports: [NgnColorPicker],
  template: `
    <awd-color-picker
      [inline]="true"
      [swatches]="['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']"
      [value]="value()"
      (valueChange)="value.set($event)"
    />
  `,
})
export class Demo_ColorPicker_Swatches {
  protected readonly value = signal('#3b82f6');
}
