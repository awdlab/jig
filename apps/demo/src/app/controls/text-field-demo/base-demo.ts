import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgnInput } from '@ngneers/controls/input';

@Component({
  imports: [FormsModule, NgnInput],
  selector: 'ngn-text-field-base',
  template: `
    <input ngnInput [ngModel]="value()" (ngModelChange)="value.set($event)" />
    {{ value() }}
  `,
})
export class TextField_Base_Component {
  protected readonly value = signal<string>('');
}
