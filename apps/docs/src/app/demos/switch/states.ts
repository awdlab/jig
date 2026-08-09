import { Component, signal } from '@angular/core';
import { JigSwitch } from '@awdlab/jig/switch';

@Component({
  imports: [JigSwitch],
  selector: 'jig-demo-switch-states',
  template: `
    Default:
    <jig-switch [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <jig-switch [value]="value()" (valueChange)="value.set($event)" disabled />
    Readonly:
    <jig-switch [value]="value()" (valueChange)="value.set($event)" readonly />
    Invalid:
    <jig-switch
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <jig-switch
      [value]="value()"
      (valueChange)="value.set($event)"
      [invalidOn]="'immediate'"
      invalid
      disabled
    />
    Invalid + Readonly:
    <jig-switch
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
