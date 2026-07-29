import { Component, signal } from '@angular/core';
import { NgnToggleButton } from '@ngneers/controls/toggle-button';

@Component({
  imports: [NgnToggleButton],
  selector: 'ngn-demo-toggle-button-states',
  template: `
    Default:
    <ngn-toggle-button [value]="value()" (valueChange)="value.set($event)" label="Toggle" />
    Disabled:
    <ngn-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      disabled
    />
    Readonly:
    <ngn-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      readonly
    />
    Invalid:
    <ngn-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <ngn-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      disabled
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Readonly:
    <ngn-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      readonly
      [invalidOn]="'immediate'"
      invalid
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
export class Demo_ToggleButton_States {
  protected readonly value = signal(false);
}
