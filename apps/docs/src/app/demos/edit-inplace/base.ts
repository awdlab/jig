import { Component, signal } from '@angular/core';
import { NgnEditInplace } from '@awdlab/jig/edit-inplace';

@Component({
  imports: [NgnEditInplace],
  selector: 'awd-demo-inplace-base',
  template: ` <awd-edit-inplace #inplace [value]="value()" (valueChange)="value.set($event)" />`,
  host: { style: 'display: block; width: 200px;' },
})
export class Demo_EditInplace_Base {
  public readonly value = signal('Edit me');
}
