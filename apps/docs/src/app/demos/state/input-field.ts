import { Component } from '@angular/core';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnState } from '@ngneers/controls/state';
import { NgnTooltip } from '@ngneers/controls/tooltip';

@Component({
  imports: [NgnState, NgnInput, NgnInputField, NgnTooltip],
  selector: 'ngn-demo-state-input-field',
  template: `
    <div class="grid max-w-lg gap-4">
      <ngn-input-field label="Repository">
        <input ngnInput value="@ngneers/controls" />
        <ngn-state kind="success" />
      </ngn-input-field>
      <ngn-input-field label="Package name">
        <input ngnInput value="controls" />
        <ngn-state kind="warning" ngnTooltip="Unknown package name." />
      </ngn-input-field>
      <ngn-input-field label="Publish target">
        <input ngnInput value="production" />
        <ngn-state kind="loading" />
      </ngn-input-field>
    </div>
  `,
})
export class Demo_State_InputField {}
