import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { NgnSelectButton } from '@ngneers/controls/select-button';

import type { NgnItem } from '@ngneers/controls/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnSelectButton],
  selector: 'ngn-demo-select-button-states',
  template: `
    Default:
    <ngn-select-button [options]="options" [value]="value()" (valueChange)="value.set($event)" />
    Disabled:
    <ngn-select-button
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      disabled
    />
    Readonly:
    <ngn-select-button
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
      readonly
    />
    Invalid:
    <ngn-select-button
      [options]="options"
      [value]="value()"
      (valueChange)="value.set($event)"
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
  ] as const satisfies NgnItem[];
}
