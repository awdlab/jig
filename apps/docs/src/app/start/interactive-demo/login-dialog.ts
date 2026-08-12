import { Component, computed, effect, model, signal } from '@angular/core';
import { form, FormField, pattern, required, submit } from '@angular/forms/signals';
import tablerLock from '@iconify/icons-tabler/lock';
import tablerUser from '@iconify/icons-tabler/user';
import { JigButton } from '@awdlab/jig/button';
import { JigDialog } from '@awdlab/jig/dialog';
import { JigErrors } from '@awdlab/jig/errors';
import { JigHint } from '@awdlab/jig/hint';
import { JigIcon } from '@awdlab/jig/icon';
import { JigInput } from '@awdlab/jig/input';
import { JigInputField } from '@awdlab/jig/input-field';
import { JigOtp } from '@awdlab/jig/otp';
import { JigState } from '@awdlab/jig/state';

/**
 * Fake login modal for the startpage demo — pure UI showcase, no real auth.
 *
 * Uses Angular signal forms end to end: `form()` + `required`/`pattern`
 * validators, the `[formField]` directive for two-way control binding, and
 * `submit()` for the faked async round-trip (loading state + a server-side
 * "wrong code" error that attaches straight onto the OTP field). Validation
 * messages are rendered by `jigErrors` → `jig-hint`, which reads the interop
 * `NgControl` that `[formField]` provides — no manual error wiring. Kept in its
 * own component so it can be `@defer`-loaded, keeping the form controls out of
 * the eager startpage bundle.
 */
@Component({
  selector: 'jig-docs-login-dialog',
  imports: [
    FormField,
    JigButton,
    JigDialog,
    JigErrors,
    JigHint,
    JigIcon,
    JigInput,
    JigInputField,
    JigOtp,
    JigState,
  ],
  template: `
    <jig-dialog
      title="Sign in"
      [modal]="true"
      [open]="open()"
      (openChange)="open.set($event)"
      [closeBy]="loginForm().submitting() ? 'none' : 'any'"
      [size]="{ width: '400px', maxWidth: '92vw' }"
    >
      <form
        novalidate
        class="flex flex-col gap-(--jig-size-padding-lg)"
        (submit)="onSubmit($event)"
      >
        <div class="flex flex-col gap-(--jig-size-padding-sm)">
          <label
            class="text-(length:--jig-font-size-sm) font-(--jig-font-weight-medium) text-(--jig-color-text)"
            for="login-username"
          >
            Username
          </label>
          <jig-input-field class="w-full" [inputId]="'login-username'">
            <jig-icon [icon]="userIcon" />
            <input
              jigInput
              autocomplete="username"
              placeholder="jane.doe"
              [formField]="loginForm.username"
              jigErrors
              [jigErrorsHint]="usernameHint"
            />
          </jig-input-field>
          <jig-hint #usernameHint />
        </div>

        <div class="flex flex-col gap-(--jig-size-padding-sm)">
          <label
            class="text-(length:--jig-font-size-sm) font-(--jig-font-weight-medium) text-(--jig-color-text)"
            for="login-password"
          >
            Password
          </label>
          <jig-input-field class="w-full" [inputId]="'login-password'">
            <jig-icon [icon]="lockIcon" />
            <input
              jigInput
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              [formField]="loginForm.password"
              jigErrors
              [jigErrorsHint]="passwordHint"
            />
          </jig-input-field>
          <jig-hint #passwordHint />
        </div>

        <div class="flex flex-col gap-(--jig-size-padding-sm)">
          <label
            id="login-otp-label"
            class="text-(length:--jig-font-size-sm) font-(--jig-font-weight-medium) text-(--jig-color-text)"
          >
            Verification code
          </label>
          <jig-otp
            labelledBy="login-otp-label"
            [length]="6"
            [integerOnly]="true"
            [formField]="loginForm.otp"
            jigErrorsShowOn="touched"
            jigErrors
            [jigErrorsHint]="otpHint"
          />
          <!-- Helper text and the error slot are separate hints: a hint that always
               carries content can never expand in, it would just swap its text. -->
          <jig-hint>
            Demo code:
            <span class="font-mono font-(--jig-font-weight-semibold)">123456</span>
          </jig-hint>
          <jig-hint #otpHint />
        </div>

        <button
          jigButton
          type="submit"
          color="primary"
          class="w-full justify-center"
          [disabled]="!!buttonState()"
        >
          {{ buttonLabel() }}
          <jig-state [kind]="buttonState() ?? undefined" [visible]="!!buttonState()" />
        </button>
      </form>
    </jig-dialog>
  `,
})
export class JigDocsLoginDialog {
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

  /** jig-state kind for the submit button — loading during the round-trip, success once accepted. */
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
    // attempt, mark every field touched so the jigErrors messages surface.
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
