import { Component, signal } from '@angular/core';
import { NgnCheckbox } from '@awdlab/jig/checkbox';

@Component({
  imports: [NgnCheckbox],
  selector: 'awd-demo-checkbox-states',
  template: `
    Default:
    <awd-checkbox [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <awd-checkbox [value]="value()" (valueChange)="value.set($event)" disabled />
    Readonly:
    <awd-checkbox [value]="value()" (valueChange)="value.set($event)" readonly />
    Invalid:
    <awd-checkbox
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <awd-checkbox
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      disabled
    />
    Invalid + Readonly:
    <awd-checkbox
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
