import { Component, computed, effect, model, signal } from '@angular/core';
import { form, FormField, pattern, required, submit } from '@angular/forms/signals';
import tablerLock from '@iconify/icons-tabler/lock';
import tablerUser from '@iconify/icons-tabler/user';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDialog } from '@awdlab/jig/dialog';
import { NgnErrors } from '@awdlab/jig/errors';
import { NgnHint } from '@awdlab/jig/hint';
import { NgnIcon } from '@awdlab/jig/icon';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnOtp } from '@awdlab/jig/otp';
import { NgnState } from '@awdlab/jig/state';

/**
 * Fake login modal for the startpage demo — pure UI showcase, no real auth.
 *
 * Uses Angular signal forms end to end: `form()` + `required`/`pattern`
 * validators, the `[formField]` directive for two-way control binding, and
 * `submit()` for the faked async round-trip (loading state + a server-side
 * "wrong code" error that attaches straight onto the OTP field). Validation
 * messages are rendered by `ngnErrors` → `awd-hint`, which reads the interop
 * `NgControl` that `[formField]` provides — no manual error wiring. Kept in its
 * own component so it can be `@defer`-loaded, keeping the form controls out of
 * the eager startpage bundle.
 */
@Component({
  selector: 'awd-docs-login-dialog',
  imports: [
    FormField,
    NgnButton,
    NgnDialog,
    NgnErrors,
    NgnHint,
    NgnIcon,
    NgnInput,
    NgnInputField,
    NgnOtp,
    NgnState,
  ],
  template: `
    <awd-dialog
      title="Sign in"
      [modal]="true"
      [open]="open()"
      (openChange)="open.set($event)"
      [closeBy]="loginForm().submitting() ? 'none' : 'any'"
      [size]="{ width: '400px', maxWidth: '92vw' }"
    >
      <form
        novalidate
        class="flex flex-col gap-(--awd-size-padding-lg)"
        (submit)="onSubmit($event)"
      >
        <div class="flex flex-col gap-(--awd-size-padding-sm)">
          <label
            class="text-(length:--awd-font-size-sm) font-(--awd-font-weight-medium) text-(--awd-color-text)"
            for="login-username"
          >
            Username
          </label>
          <awd-input-field class="w-full" [inputId]="'login-username'">
            <awd-icon [icon]="userIcon" />
            <input
              ngnInput
              autocomplete="username"
              placeholder="jane.doe"
              [formField]="loginForm.username"
              ngnErrors
              [ngnErrorsHint]="usernameHint"
            />
          </awd-input-field>
          <awd-hint #usernameHint />
        </div>

        <div class="flex flex-col gap-(--awd-size-padding-sm)">
          <label
            class="text-(length:--awd-font-size-sm) font-(--awd-font-weight-medium) text-(--awd-color-text)"
            for="login-password"
          >
            Password
          </label>
          <awd-input-field class="w-full" [inputId]="'login-password'">
            <awd-icon [icon]="lockIcon" />
            <input
              ngnInput
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              [formField]="loginForm.password"
              ngnErrors
              [ngnErrorsHint]="passwordHint"
            />
          </awd-input-field>
          <awd-hint #passwordHint />
        </div>

        <div class="flex flex-col gap-(--awd-size-padding-sm)">
          <label
            id="login-otp-label"
            class="text-(length:--awd-font-size-sm) font-(--awd-font-weight-medium) text-(--awd-color-text)"
          >
            Verification code
          </label>
          <awd-otp
            labelledBy="login-otp-label"
            [length]="6"
            [integerOnly]="true"
            [formField]="loginForm.otp"
            ngnErrorsShowOn="touched"
            ngnErrors
            [ngnErrorsHint]="otpHint"
          />
          <awd-hint #otpHint [content]="demoCodeTpl" />
          <ng-template #demoCodeTpl>
            Demo code:
            <span class="font-mono font-(--awd-font-weight-semibold)">123456</span>
          </ng-template>
        </div>

        <button
          ngnButton
          type="submit"
          color="primary"
          class="w-full justify-center"
          [disabled]="!!buttonState()"
        >
          {{ buttonLabel() }}
          <awd-state [kind]="buttonState() ?? undefined" [visible]="!!buttonState()" />
        </button>
      </form>
    </awd-dialog>
  `,
})
export class NgnDocsLoginDialog {
  protected readonly userIcon = tablerUser;
  protected readonly lockIcon = tablerLock;

  /** Two-way bound to the parent trigger. */
  public readonly open = model(false);

  /** Signal-forms model — the single source of truth the form writes back into. */
  protected readonly model = signal({ username: '', password: '', otp: '' });

  /** Real client-side validators. The "code must be 123456" check is a faked
   * server step in {@link onSubmit}, surfaced as a server error, not a validator. */
  protected readonly loginForm = form(this.model, path => {
    required(path.username, { message: 'Enter your username.' });
    required(path.password, { message: 'Enter your password.' });
    required(path.otp, { message: 'Enter the 6-digit code.' });
    pattern(path.otp, /^\d{6}$/, { message: 'Enter the 6-digit code.' });
  });

  /** Latches once the faked server accepts the credentials, until the dialog closes. */
  protected readonly succeeded = signal(false);

  /** awd-state kind for the submit button — loading during the round-trip, success once accepted. */
  protected readonly buttonState = computed<'loading' | 'success' | null>(() =>
    this.loginForm().submitting() ? 'loading' : this.succeeded() ? 'success' : null
  );

  protected readonly buttonLabel = computed(() => {
    if (this.loginForm().submitting()) {
      return 'Signing in…';
    }
    return this.succeeded() ? 'Signed in' : 'Sign in';
  });

  constructor() {
    // Start every session from a clean slate when the dialog opens.
    effect(() => {
      if (this.open()) {
        this.reset();
      }
    });
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.succeeded()) {
      return;
    }
    // submit() only runs the action when the form is valid. On an invalid
    // attempt, mark every field touched so the ngnErrors messages surface.
    const ok = await submit(this.loginForm, {
      onInvalid: () => this.loginForm().markAsTouched(),
      action: async () => {
        await new Promise<void>(resolve => setTimeout(resolve, 1400));
        if (this.model().otp !== '123456') {
          return [
            {
              fieldTree: this.loginForm.otp,
              kind: 'server',
              message: 'That code didn’t match. Try 123456.',
            },
          ];
        }
        return undefined;
      },
    });
    if (ok) {
      this.succeeded.set(true);
      setTimeout(() => this.open.set(false), 900);
    }
  }

  private reset(): void {
    this.model.set({ username: '', password: '', otp: '' });
    this.loginForm().reset();
    this.succeeded.set(false);
  }
}
