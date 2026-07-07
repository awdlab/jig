import { Component } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnState } from '@ngneers/controls/state';

@Component({
  imports: [NgnState, NgnButton],
  selector: 'ngn-demo-state-button',
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <button ngnButton>
        Save
        <ngn-state kind="loading" />
      </button>
      <button ngnButton>
        Publishing
        <ngn-state kind="loading" replaceContent />
      </button>
      <button ngnButton kind="secondary">
        Saved
        <ngn-state kind="success" />
      </button>
      <button ngnButton kind="secondary">
        Review
        <ngn-state kind="warning" />
      </button>
      <button ngnButton kind="secondary">
        Failed
        <ngn-state kind="error" />
      </button>
      <button ngnButton kind="secondary">
        Cancelled
        <ngn-state kind="cancelled" />
      </button>
    </div>
  `,
})
export class Demo_State_Button {}
