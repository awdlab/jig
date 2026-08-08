import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnAutofocus } from '@ngneers/controls/directives';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

@Component({
  selector: 'ngn-demo-autofocus-base',
  imports: [NgnAutofocus, NgnButton, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col items-start gap-3">
      <button ngnButton (click)="editing.set(!editing())">
        {{ editing() ? 'Cancel' : 'Rename' }}
      </button>

      @if (editing()) {
        <ngn-input-field [label]="'New name'" class="w-72">
          <input ngnInput ngnAutofocus [value]="name()" (valueChange)="name.set($event ?? '')" />
        </ngn-input-field>
      }
    </div>
  `,
})
export class Demo_Autofocus_Base {
  protected readonly editing = signal(false);
  protected readonly name = signal('Untitled');
}
