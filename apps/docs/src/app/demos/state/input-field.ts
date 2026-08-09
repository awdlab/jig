import { Component } from '@angular/core';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdState } from '@awdlab/jig/state';
import { AwdTooltip } from '@awdlab/jig/tooltip';

@Component({
  imports: [AwdState, AwdInput, AwdInputField, AwdTooltip],
  selector: 'jig-demo-state-input-field',
  template: `
    <div class="grid max-w-lg gap-4">
      <jig-input-field label="Repository">
        <input ngnInput value="@awdlab/jig" />
        <jig-state kind="success" />
      </jig-input-field>
      <jig-input-field label="Package name">
        <input ngnInput value="controls" />
        <jig-state kind="warning" ngnTooltip="Unknown package name." />
      </jig-input-field>
      <jig-input-field label="Publish target">
        <input ngnInput value="production" />
        <jig-state kind="loading" />
      </jig-input-field>
    </div>
  `,
})
export class Demo_State_InputField {}
