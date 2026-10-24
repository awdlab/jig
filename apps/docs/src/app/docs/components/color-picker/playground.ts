import { Component, signal, viewChild } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigColorPicker } from '@awdlab/jig/color-picker';

import { JigDocsPlayground } from '../../../utils/playground/playground';

@Component({
  selector: 'jig-docs-color-picker-playground',
  imports: [JigColorPicker, JigButton, JigDocsPlayground],
  template: `
    <jig-docs-playground
      #playground
      [controls]="[{ componentName: 'JigColorPicker', component: component() }]"
    >
      @if (playground.values().JigColorPicker?.popover) {
        <button jigButton #anchor (click)="ref.toggle()">Pick a color</button>
        <jig-color-picker
          #ref
          [anchor]="anchor"
          [value]="value()"
          (valueChange)="value.set($event)"
        />
      } @else {
        <jig-color-picker #ref [value]="value()" (valueChange)="value.set($event)" />
      }
    </jig-docs-playground>
  `,
})
export class JigDocsColorPickerPlayground {
  protected readonly component = viewChild('ref', { read: JigColorPicker });
  protected readonly value = signal('#3b82f6');
}
