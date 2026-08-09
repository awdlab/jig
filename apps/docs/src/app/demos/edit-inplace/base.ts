import { Component, signal } from '@angular/core';
import { AwdEditInplace } from '@awdlab/jig/edit-inplace';

@Component({
  imports: [AwdEditInplace],
  selector: 'jig-demo-inplace-base',
  template: ` <jig-edit-inplace #inplace [value]="value()" (valueChange)="value.set($event)" />`,
  host: { style: 'display: block; width: 200px;' },
})
export class Demo_EditInplace_Base {
  public readonly value = signal('Edit me');
}
