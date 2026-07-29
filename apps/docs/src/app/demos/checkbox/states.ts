import { Component, signal } from '@angular/core';
import { NgnCheckbox } from '@ngneers/controls/checkbox';

@Component({
  imports: [NgnCheckbox],
  selector: 'ngn-demo-checkbox-states',
  template: `
    Default:
    <ngn-checkbox [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <ngn-checkbox [value]="value()" (valueChange)="value.set($event)" disabled />
    Readonly:
    <ngn-checkbox [value]="value()" (valueChange)="value.set($event)" readonly />
    Invalid:
    <ngn-checkbox
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <ngn-checkbox
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      disabled
    />
    Invalid + Readonly:
    <ngn-checkbox
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
