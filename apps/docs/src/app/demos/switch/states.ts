import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnSwitch } from '@ngneers/controls/switch';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSwitch],
  selector: 'ngn-demo-switch-states',
  template: `
    Default:
    <ngn-switch [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <ngn-switch [value]="value()" (valueChange)="value.set($event)" disabled />
    Readonly:
    <ngn-switch [value]="value()" (valueChange)="value.set($event)" readonly />
    Invalid:
    <ngn-switch [value]="value()" (valueChange)="value.set($event)" invalid />
    Invalid + Disabled:
    <ngn-switch [value]="value()" (valueChange)="value.set($event)" invalid disabled />
    Invalid + Readonly:
    <ngn-switch [value]="value()" (valueChange)="value.set($event)" invalid readonly />
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
