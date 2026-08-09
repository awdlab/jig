import { Component, signal } from '@angular/core';
import { JigSelectButton } from '@awdlab/jig/select-button';

import type { JigItem } from '@awdlab/jig/api';

@Component({
  imports: [JigSelectButton],
  selector: 'jig-demo-select-button-states',
  template: `
    Default:
    <jig-select-button [options]="options" [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <jig-select-button
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      disabled
    />
    Readonly:
    <jig-select-button
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      readonly
    />
    Invalid:
    <jig-select-button
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
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
export class Demo_SelectButton_States {
  protected readonly value = signal<number | null>(null);

  public readonly options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ] as const satisfies JigItem[];
}
