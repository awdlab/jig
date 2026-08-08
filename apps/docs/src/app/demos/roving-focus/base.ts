import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';

@Component({
  selector: 'ngn-demo-roving-focus-base',
  imports: [NgnButton, NgnRovingGroup, NgnRovingItem],
  template: `
    <div class="flex flex-col items-start gap-3">
      <div
        ngnRovingGroup
        rovingWrap
        orientation="horizontal"
        role="toolbar"
        aria-label="Text formatting"
        class="flex gap-1"
        (activeItemChange)="active.set($event)"
      >
        @for (tool of tools; track tool) {
          <button ngnButton ngnRovingItem kind="secondary">{{ tool }}</button>
        }
      </div>

      <p>Tab into the toolbar, then use ←/→ and Home/End. Active index: {{ active() }}</p>
    </div>
  `,
})
export class Demo_RovingFocus_Base {
  protected readonly tools = ['Bold', 'Italic', 'Underline', 'Link', 'Code'];
  protected readonly active = signal(0);
}
