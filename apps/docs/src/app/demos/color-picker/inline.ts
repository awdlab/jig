import { Component, signal } from '@angular/core';
import { AwdColorPicker } from '@awdlab/jig/color-picker';

@Component({
  selector: 'jig-demo-color-picker-inline',
  imports: [AwdColorPicker],
  template: `<jig-color-picker
    [inline]="true"
    [value]="value()"
    (valueChange)="value.set($event)"
  />`,
})
export class Demo_ColorPicker_Inline {
  protected readonly value = signal('#10b981');
}
