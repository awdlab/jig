import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnEditInplace } from '@ngneers/controls/edit-inplace';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnEditInplace, FormsModule],
  selector: 'ngn-demo-inplace-base',
  template: ` <ngn-edit-inplace
    #inplace
    [ngModel]="value()"
    (ngModelChange)="value.set($event)"
  />`,
})
export class Demo_EditInplace_Base {
  public readonly value = signal('Edit me');
}
