import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdAutofocus } from '@awdlab/jig/directives';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

@Component({
  selector: 'jig-demo-autofocus-base',
  imports: [AwdAutofocus, AwdButton, AwdInput, AwdInputField],
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
