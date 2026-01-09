import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputField],
  selector: 'ngn-demo-input-field-label',
  template: `
    <ngn-input-field [label]="'label over'" [labelKind]="'over'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    <ngn-input-field [label]="'label in'" [labelKind]="'in'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    <ngn-input-field [label]="'label on'" [labelKind]="'on'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
  `,
})
export class Demo_InputField_Label {
  protected readonly value = signal<string>('');
}
