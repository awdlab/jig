import { Component, signal } from '@angular/core';
import { AwdCheckbox } from '@awdlab/jig/checkbox';

@Component({
  imports: [AwdCheckbox],
  selector: 'jig-demo-checkbox-states',
  template: `
    Default:
    <jig-checkbox [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <jig-checkbox [value]="value()" (valueChange)="value.set($event)" disabled />
    Readonly:
    <jig-checkbox [value]="value()" (valueChange)="value.set($event)" readonly />
    Invalid:
    <jig-checkbox
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <jig-checkbox
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      disabled
    />
    Invalid + Readonly:
    <jig-checkbox
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      readonly
    />
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: fit-content(200px) 1fr;
      gap: 1rem;
      align-items: center;
    }
  `,
})
export class Demo_Checkbox_States {
  protected readonly value = signal(false);
}
