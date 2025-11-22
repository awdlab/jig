import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnInput } from '@ngneers/controls/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgnInput],
  selector: 'ngn-demo-input-base',
  template: `
    <input ngnInput [ngModel]="value()" (ngModelChange)="value.set($event)" />
    {{ value() }}
  `,
})
export class Demo_Input_Base {
  protected readonly value = signal<string>('');
}
