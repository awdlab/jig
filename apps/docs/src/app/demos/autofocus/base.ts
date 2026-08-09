import { Component, signal } from '@angular/core';
import { JigButton } from '@awdlab/jig/button';
import { JigAutofocus } from '@awdlab/jig/directives';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-autofocus-base',
  imports: [JigAutofocus, JigButton, JigInput, JigInputField],
  template: `
    <div class="flex flex-col items-start gap-3">
      <button ngnButton (click)="editing.set(!editing())">
        {{ editing() ? 'Cancel' : 'Rename' }}
      </button>

      @if (editing()) {
        <jig-input-field [label]="'New name'" class="w-72">
          <input ngnInput ngnAutofocus [value]="name()" (valueChange)="name.set($event ?? '')" />
        </jig-input-field>
      }
    </div>
  `,
})
export class Demo_Autofocus_Base {
  protected readonly editing = signal(false);
  protected readonly name = signal('Untitled');
}
