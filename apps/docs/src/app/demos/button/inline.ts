import { Component } from '@angular/core';
import tablerCopy from '@iconify/icons-tabler/copy';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-button-inline',
  imports: [JigButton, JigIcon, JigInput, JigInputField],
  template: `
    <div class="flex flex-col items-start gap-4">
      <p class="max-w-prose">
        An inline icon button is one line-height tall, so it fits a line of text or a dense
        adornment slot:
        <button jigButton kind="icon" jigButtonInline aria-label="Copy">
          <jig-icon [icon]="copy" />
        </button>
        sits inside the line, while the same button without <code>inline</code>
        <button jigButton kind="icon" aria-label="Copy">
          <jig-icon [icon]="copy" />
        </button>
        drops out of the sentence onto its own line, because a full-size button is a block-level box
        at the control height. For a text-level action, reach for <code>kind="link"</code>
        instead — inline changes the size and flow, never the chrome.
      </p>
      <!-- The clear button an jig-input-field renders is exactly this: kind="icon" + inline,
           so it fits the field's line box instead of stretching it. -->
      <jig-input-field label="Adornments use it too" showClearButton class="w-64">
        <input jigInput value="Clear me" />
      </jig-input-field>
    </div>
  `,
})
export class Demo_Button_Inline {
  protected readonly copy = tablerCopy;
}
