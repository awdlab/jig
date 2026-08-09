import { Component, signal } from '@angular/core';
import { JigEditInplace } from '@awdlab/jig/edit-inplace';

@Component({
  imports: [JigEditInplace],
  selector: 'jig-demo-inplace-states',
  template: `
    Default:
    <jig-edit-inplace [value]="value()" (valueChange)="value.set($event)" /><br />
    Readonly:
    <jig-edit-inplace [value]="value()" (valueChange)="value.set($event)" readonly /><br />
    Disabled:
    <jig-edit-inplace [value]="value()" (valueChange)="value.set($event)" disabled /><br />
    Invalid:
    <jig-edit-inplace
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
    /><br />
    Invalid + Readonly:
    <jig-edit-inplace
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      readonly
    /><br />
    Invalid + Disabled:
    <jig-edit-inplace
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
