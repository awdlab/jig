import { Component, signal, viewChild } from '@angular/core';
import { NgnColorPicker } from '@awdlab/jig/color-picker';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'awd-docs-color-picker-playground',
  imports: [NgnColorPicker, NgnDocsPlayground],
  template: `
    <awd-docs-playground [controls]="[{ componentName: 'NgnColorPicker', component: component() }]">
      <awd-color-picker #ref [value]="value()" (valueChange)="value.set($event)" />
    </awd-docs-playground>
  `,
})
export class NgnDocsColorPickerPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnColorPicker });
  protected readonly value = signal('#3b82f6');
}
