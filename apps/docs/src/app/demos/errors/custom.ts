import { Component, signal } from '@angular/core';
import { AwdButton } from '@awdlab/jig/button';
import { AwdErrors } from '@awdlab/jig/errors';
import { AwdHint } from '@awdlab/jig/hint';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';

import type { AwdErrorsCustom } from '@awdlab/jig/errors';

@Component({
  selector: 'jig-demo-errors-custom',
  imports: [AwdButton, AwdErrors, AwdHint, AwdInput, AwdInputField],
  template: `
    <div class="flex flex-col items-start gap-3">
      <div class="flex flex-col gap-1">
        <jig-input-field [label]="'Username'" [labelKind]="'on'" class="w-72">
          <input
            ngnInput
            [value]="username()"
            (valueChange)="onChange($event)"
            ngnErrors
            ngnErrorsShowOn="always"
            [ngnErrorsCustom]="serverErrors()"
            [ngnErrorsHint]="hint"
          />
        </jig-input-field>
        <jig-hint #hint />
      </div>

      <button ngnButton (click)="submit()">Check availability</button>
    </div>
  `,
})
export class Demo_Errors_Custom {
  protected readonly username = signal('ada');
  protected readonly serverErrors = signal<AwdErrorsCustom>(null);

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
