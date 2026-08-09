import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnAutofocus } from '@awdlab/jig/directives';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'awd-demo-autofocus-base',
  imports: [NgnAutofocus, NgnButton, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col items-start gap-3">
      <button ngnButton (click)="editing.set(!editing())">
        {{ editing() ? 'Cancel' : 'Rename' }}
      </button>

      @if (editing()) {
        <awd-input-field [label]="'New name'" class="w-72">
          <input ngnInput ngnAutofocus [value]="name()" (valueChange)="name.set($event ?? '')" />
        </awd-input-field>
      }
    </div>
  `,
})
export class Demo_Autofocus_Base {
  protected readonly editing = signal(false);
  protected readonly name = signal('Untitled');
}
