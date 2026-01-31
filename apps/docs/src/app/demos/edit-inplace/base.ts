import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnEditInplace } from '@ngneers/controls/edit-inplace';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnEditInplace],
  selector: 'ngn-demo-inplace-base',
  template: ` <ngn-edit-inplace #inplace [value]="value()" (valueChange)="value.set($event)" />`,
  host: { style: 'display: block; width: 200px;' },
})
export class Demo_EditInplace_Base {
  public readonly value = signal('Edit me');
}
