import { Component, signal } from '@angular/core';
import { AwdToggleButton } from '@awdlab/jig/toggle-button';

@Component({
  imports: [AwdToggleButton],
  selector: 'jig-demo-toggle-button-states',
  template: `
    Default:
    <jig-toggle-button [value]="value()" (valueChange)="value.set($event)" label="Toggle" />
    Disabled:
    <jig-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      disabled
    />
    Readonly:
    <jig-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      readonly
    />
    Invalid:
    <jig-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Disabled:
    <jig-toggle-button
      [value]="value()"
      (valueChange)="value.set($event)"
      label="Toggle"
      disabled
      [invalidOn]="'immediate'"
      invalid
    />
    Invalid + Readonly:
    <jig-toggle-button
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
