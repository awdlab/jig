import { Component, signal } from '@angular/core';
import { JigEditInplace } from '@awdlab/jig/edit-inplace';

@Component({
  imports: [JigEditInplace],
  selector: 'jig-demo-inplace-base',
  template: ` <jig-edit-inplace #inplace [value]="value()" (valueChange)="value.set($event)" />`,
  host: { style: 'display: block; width: 200px;' },
})
export class Demo_EditInplace_Base {
  public readonly value = signal('Edit me');
}
