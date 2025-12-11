import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput],
  selector: 'ngn-demo-input-base',
  template: `
    <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    {{ value() }}
  `,
})
export class Demo_Input_Base {
  protected readonly value = signal<string>('');
}
