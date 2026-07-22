import { Component, signal, viewChild } from '@angular/core';
import { NgnColorPicker } from '@ngneers/controls/color-picker';

import { NgnDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'ngn-docs-color-picker-playground',
  imports: [NgnColorPicker, NgnDocsPlayground],
  template: `
    <ngn-docs-playground [controls]="[{ componentName: 'NgnColorPicker', component: component() }]">
      <ngn-color-picker #ref [value]="value()" (valueChange)="value.set($event)" />
    </ngn-docs-playground>
  `,
})
export class NgnDocsColorPickerPlayground {
  protected readonly component = viewChild.required('ref', { read: NgnColorPicker });
  protected readonly value = signal('#3b82f6');
}
