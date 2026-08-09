import { Component, signal, viewChild } from '@angular/core';
import { JigColorPicker } from '@awdlab/jig/color-picker';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-color-picker-playground',
  imports: [JigColorPicker, JigDocsPlayground],
  template: `
    <jig-docs-playground [controls]="[{ componentName: 'JigColorPicker', component: component() }]">
      <jig-color-picker #ref [value]="value()" (valueChange)="value.set($event)" />
    </jig-docs-playground>
  `,
})
export class JigDocsColorPickerPlayground {
  protected readonly component = viewChild.required('ref', { read: JigColorPicker });
  protected readonly value = signal('#3b82f6');
}
