import { Component, signal } from '@angular/core';
import { NgnButton } from '@awdlab/jig/button';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';

import type { NgnErrorsCustom } from '@awdlab/jig/errors';

@Component({
  selector: 'awd-demo-errors-custom',
  imports: [NgnButton, NgnErrors, NgnHint, NgnInput, NgnInputField],
  template: `
    <div class="flex flex-col items-start gap-3">
      <div class="flex flex-col gap-1">
        <awd-input-field [label]="'Username'" [labelKind]="'on'" class="w-72">
          <input
            ngnInput
            [value]="username()"
            (valueChange)="onChange($event)"
            ngnErrors
            ngnErrorsShowOn="always"
            [ngnErrorsCustom]="serverErrors()"
            [ngnErrorsHint]="hint"
          />
        </awd-input-field>
        <awd-hint #hint />
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
