import { Component, signal } from '@angular/core';
import { NgnColorPicker } from '@ngneers/controls/color-picker';

@Component({
  selector: 'ngn-demo-color-picker-inline',
  imports: [NgnColorPicker],
  template: `<ngn-color-picker
    [inline]="true"
    [value]="value()"
    (valueChange)="value.set($event)"
  />`,
})
export class Demo_ColorPicker_Inline {
  protected readonly value = signal('#10b981');
}
