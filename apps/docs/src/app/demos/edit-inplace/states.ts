import { Component, signal } from '@angular/core';
import { NgnEditInplace } from '@ngneers/controls/edit-inplace';

@Component({
  imports: [NgnEditInplace],
  selector: 'ngn-demo-inplace-states',
  template: `
    Default:
    <ngn-edit-inplace [value]="value()" (valueChange)="value.set($event)" /><br />
    Readonly:
    <ngn-edit-inplace [value]="value()" (valueChange)="value.set($event)" readonly /><br />
    Disabled:
    <ngn-edit-inplace [value]="value()" (valueChange)="value.set($event)" disabled /><br />
    Invalid:
    <ngn-edit-inplace [value]="value()" (valueChange)="value.set($event)" invalid /><br />
    Invalid + Readonly:
    <ngn-edit-inplace [value]="value()" (valueChange)="value.set($event)" invalid readonly /><br />
    Invalid + Disabled:
    <ngn-edit-inplace [value]="value()" (valueChange)="value.set($event)" invalid disabled /><br />
  `,
  host: { style: 'display: block; width: 400px;' },
})
export class Demo_EditInplace_States {
  public readonly value = signal('Edit me');
}
