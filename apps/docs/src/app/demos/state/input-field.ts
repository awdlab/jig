import { Component } from '@angular/core';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnState } from '@awdlab/jig/state';
import { NgnTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [NgnState, NgnInput, NgnInputField, NgnTooltip],
  selector: 'awd-demo-state-input-field',
  template: `
    <div class="grid max-w-lg gap-4">
      <awd-input-field label="Repository">
        <input ngnInput value="@awdlab/jig" />
        <awd-state kind="success" />
      </awd-input-field>
      <awd-input-field label="Package name">
        <input ngnInput value="controls" />
        <awd-state kind="warning" ngnTooltip="Unknown package name." />
      </awd-input-field>
      <awd-input-field label="Publish target">
        <input ngnInput value="production" />
        <awd-state kind="loading" />
      </awd-input-field>
    </div>
  `,
})
export class Demo_State_InputField {}
