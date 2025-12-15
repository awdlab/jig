import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnInput, NgnInputField],
  selector: 'ngn-demo-input-field-states',
  template: `
    Default:
    <ngn-input-field [inputId]="'test-input'">
      <input ngnInput />
    </ngn-input-field>
    Disabled:
    <ngn-input-field [inputId]="'test-input'">
      <input ngnInput [disabled]="true" />
    </ngn-input-field>
    Readonly:
    <ngn-input-field [inputId]="'test-input'">
      <input ngnInput [readOnly]="true" />
    </ngn-input-field>
    Invalid:
    <ngn-input-field [inputId]="'test-input'">
      <input ngnInput [invalid]="true" />
    </ngn-input-field>
    Disabled + Invalid:
    <ngn-input-field [inputId]="'test-input'">
      <input ngnInput [invalid]="true" [disabled]="true" />
    </ngn-input-field>
    Readonly + Invalid:
    <ngn-input-field [inputId]="'test-input'">
      <input ngnInput [invalid]="true" [readOnly]="true" />
    </ngn-input-field>
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
export class Demo_InputField_States {}
