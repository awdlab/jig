import { Component, signal } from '@angular/core';
import { NgnEditInplace } from '@awdlab/jig/edit-inplace';

@Component({
  imports: [NgnEditInplace],
  selector: 'awd-demo-inplace-states',
  template: `
    Default:
    <awd-edit-inplace [value]="value()" (valueChange)="value.set($event)" /><br />
    Readonly:
    <awd-edit-inplace [value]="value()" (valueChange)="value.set($event)" readonly /><br />
    Disabled:
    <awd-edit-inplace [value]="value()" (valueChange)="value.set($event)" disabled /><br />
    Invalid:
    <awd-edit-inplace
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
    /><br />
    Invalid + Readonly:
    <awd-edit-inplace
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      readonly
    /><br />
    Invalid + Disabled:
    <awd-edit-inplace
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      disabled
    /><br />
  `,
  host: { style: 'display: block; width: 400px;' },
})
export class Demo_EditInplace_States {
  public readonly value = signal('Edit me');
}
