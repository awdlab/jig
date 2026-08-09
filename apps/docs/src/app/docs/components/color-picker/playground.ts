import { Component, signal, viewChild } from '@angular/core';
import { AwdColorPicker } from '@awdlab/jig/color-picker';

import { AwdDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-color-picker-playground',
  imports: [AwdColorPicker, AwdDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'AwdColorPicker', component: component() }]">
      <jig-color-picker #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class AwdDocsColorPickerPlayground {
  protected readonly component = viewChild.required('ref', { read: AwdColorPicker });
  protected readonly value = signal('#3b82f6');
}
