import { Component, signal } from '@angular/core';
import { NgnToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  imports: [NgnToggleButton],
  selector: 'awd-demo-toggle-button-states',
  template: `
    Default:
    <awd-toggle-button [value]="value()" (valueChange)="value.set($event)" label="Toggle" />
    Disabled:
    <awd-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      disabled
    />
    Readonly:
    <awd-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      readonly
    />
    Invalid:
    <awd-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <awd-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      disabled
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Readonly:
    <awd-toggle-button
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
