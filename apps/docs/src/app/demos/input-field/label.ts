import { Component, signal } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  imports: [NgnInput, NgnInputField],
  selector: 'awd-demo-input-field-label',
  host: {
    style: 'display: flex; flex-direction: column; gap: 1.5rem; padding-top: 1rem;',
  },
  template: `
    <awd-input-field [label]="'Label over'" [labelKind]="'over'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
    <awd-input-field [label]="'Label in'" [labelKind]="'in'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
    <awd-input-field [label]="'Label on'" [labelKind]="'on'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
    <awd-input-field [label]="'FloatLabel over'" [labelKind]="'floatOver'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
    <awd-input-field [label]="'FloatLabel in'" [labelKind]="'floatIn'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
    <awd-input-field [label]="'FloatLabel on'" [labelKind]="'floatOn'">
      <input ngnInput [value]="value()" (valueChange)="value.set($event ?? '')" />
    </awd-input-field>
  `,
})
export class Demo_InputField_Label {
  protected readonly value = signal<string>('');
}
