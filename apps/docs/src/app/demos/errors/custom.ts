import { Component, signal } from '@angular/core';
import { NgnButton } from '@ngneers/controls/button';
import { NgnErrors } from '@ngneers/controls/errors';
import { NgnHint } from '@ngneers/controls/hint';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';

import type { NgnErrorsCustom } from '@ngneers/controls/errors';

@Component({
  selector: 'ngn-demo-errors-custom',
  imports: [NgnButton, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col items-start gap-3">
      <div class="flex flex-col gap-1">
        <ngn-input-field [label]="'Username'" [labelKind]="'on'" class="w-72">
          <input
            ngnInput
            [value]="username()"
            (valueChange)="onChange($event)"
            ngnErrors
            ngnErrorsShowOn="always"
            [ngnErrorsCustom]="serverErrors()"
            [ngnErrorsHint]="hint"
          />
        </ngn-input-field>
        <ngn-hint #hint />
      </div>

      <button ngnButton (click)="submit()">Check availability</button>
    </div>
  `,
})
export class Demo_Errors_Custom {
  protected readonly username = signal('ada');
  protected readonly serverErrors = signal<NgnErrorsCustom>(null);

  protected onChange(value: string | null): void {
    this.username.set(value ?? '');
    // A new attempt invalidates the previous server verdict.
    this.serverErrors.set(null);
  }

  /** Server-side verdicts arrive as entries with their own message. */
  protected submit(): void {
    this.serverErrors.set(
      this.username() === 'ada'
        ? [{ key: 'taken', message: `"${this.username()}" is already taken.` }]
        : null
    );
  }
}
