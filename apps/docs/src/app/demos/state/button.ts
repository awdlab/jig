import { Component } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnState } from '@awdlab/jig/state';

@Component({
  imports: [NgnState, NgnButton],
  selector: 'awd-demo-state-button',
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <button ngnButton>
        Save
        <awd-state kind="loading" />
      </button>
      <button ngnButton>
        Publishing
        <awd-state kind="loading" replaceContent />
      </button>
      <button ngnButton kind="secondary">
        Saved
        <awd-state kind="success" />
      </button>
      <button ngnButton kind="secondary">
        Review
        <awd-state kind="warning" />
      </button>
      <button ngnButton kind="secondary">
        Failed
        <awd-state kind="error" />
      </button>
      <button ngnButton kind="secondary">
        Cancelled
        <awd-state kind="cancelled" />
      </button>
    </div>
  `,
})
export class Demo_State_Button {}
