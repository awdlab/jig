import { Component } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigState } from '@awdlab/jig/state';

@Component({
  imports: [JigState, JigButton],
  selector: 'jig-demo-state-button',
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <button jigButton>
        Save
        <jig-state kind="loading" />
      </button>
      <button jigButton>
        Publishing
        <jig-state kind="loading" replaceContent />
      </button>
      <button jigButton kind="secondary">
        Saved
        <jig-state kind="success" />
      </button>
      <button jigButton kind="secondary">
        Review
        <jig-state kind="warning" />
      </button>
      <button jigButton kind="secondary">
        Failed
        <jig-state kind="error" />
      </button>
      <button jigButton kind="secondary">
        Cancelled
        <jig-state kind="cancelled" />
      </button>
    </div>
  `,
})
export class Demo_State_Button {}
