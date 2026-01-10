import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputField],
  selector: 'ngn-demo-input-field-label',
  host: {
    style: 'display: flex; flex-direction: column; gap: 1.5rem; padding-top: 1rem;',
  },
  template: `
    <ngn-input-field [label]="'Label over'" [labelKind]="'over'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    <ngn-input-field [label]="'Label in'" [labelKind]="'in'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    <ngn-input-field [label]="'Label on'" [labelKind]="'on'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    <ngn-input-field [label]="'FloatLabel over'" [labelKind]="'floatOver'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    <ngn-input-field [label]="'FloatLabel in'" [labelKind]="'floatIn'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
    <ngn-input-field [label]="'FloatLabel on'" [labelKind]="'floatOn'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </ngn-input-field>
  `,
})
export class Demo_InputField_Label {
  protected readonly value = signal<string>('');
}
