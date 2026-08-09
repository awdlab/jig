import { Component, signal } from '@angular/core';
import { NgnSwitch } from '@awdlab/jig/switch';

@Component({
  imports: [NgnSwitch],
  selector: 'awd-demo-switch-states',
  template: `
    Default:
    <awd-switch [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <awd-switch [value]="value()" (valueChange)="value.set($event)" disabled />
    Readonly:
    <awd-switch [value]="value()" (valueChange)="value.set($event)" readonly />
    Invalid:
    <awd-switch
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <awd-switch
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      disabled
    />
    Invalid + Readonly:
    <awd-switch
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
export class Demo_Switch_States {
  protected readonly value = signal(false);
}
