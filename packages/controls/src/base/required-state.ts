import {
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  type Signal,
  untracked,
} from '@angular/core';
import {
  type AbstractControl,
  FormControl,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  NgControl,
} from '@angular/forms';

interface ControlWithEvents {
  events?: { subscribe: (next: () => void) => { unsubscribe: () => void } };
}

/**
 * Whether the control carries a required validator. Probing the composed
 * validator with an empty control is the paradigm-agnostic check: it catches
 * `Validators.required`, a composed validator and the `required` attribute's
 * `RequiredValidator` alike, where `hasValidator` (reference equality) sees only
 * the first.
 */
function hasRequiredValidator(control: AbstractControl | null | undefined): boolean {
  if (!control?.validator) {
    return false;
  }
  try {
    return !!control.validator(new FormControl(null))?.['required'];
  } catch {
    // Cross-field validators may reach for a parent the probe doesn't have.
    return false;
  }
}

/**
 * The `AbstractControl` bound to the host element, re-read whenever it emits.
 * `control` is `null` when no form directive sits on the host. Wrapped in a
 * fresh object so a re-read propagates even though the control instance stays
 * the same. Must be called in an injection context.
 */
function injectBoundControl(): Signal<{ control: AbstractControl | null }> {
  const ngControl = inject(NgControl, { optional: true, self: true });
  if (!ngControl) {
    return signal({ control: null }).asReadonly();
  }
  const destroyRef = inject(DestroyRef);
  const revision = signal(0);
  let watched: AbstractControl | null = null;
  let subscription: { unsubscribe: () => void } | undefined;

  // Re-arms onto whichever control is bound now — a rebound `[formControl]` swaps the
  // instance, and the one we were listening to stops reporting.
  const watch = (control: AbstractControl | null): void => {
    if (control === watched) {
      return;
    }
    subscription?.unsubscribe();
    watched = control;
    subscription = (control as ControlWithEvents | null)?.events?.subscribe(() =>
      revision.update(value => value + 1)
    );
  };
  destroyRef.onDestroy(() => subscription?.unsubscribe());

  // The `AbstractControl` resolves only once the form directive has registered.
  queueMicrotask(() => revision.update(value => value + 1));

  return computed(() => {
    revision();
    const control = ngControl.control;
    watch(control);
    return { control };
  });
}

/**
 * Reactive required state of a reactive or template-driven form control on the
 * host element. Angular binds a `required` input on controls it drives directly
 * (signal forms, and classic forms on a control without a `ControlValueAccessor`)
 * — this covers the remaining case, a native element whose classic form binding
 * runs through the default value accessor. Must be called in an injection
 * context.
 */
export function injectNgControlRequired(): Signal<boolean> {
  const bound = injectBoundControl();
  return computed(() => hasRequiredValidator(bound().control));
}

/**
 * Interaction/validity state of the form control bound to the host element
 * (reactive, template-driven, or signal forms via its interop `NgControl`), or
 * `null` when no form is in play. Classic forms drive a native-element directive
 * such as `jigInput` through the default value accessor, so they never write
 * `invalid` / `touched` / `dirty` into it — this is where it reads them instead.
 * Must be called in an injection context.
 */
export function injectNgControlStatus(): Signal<{
  invalid: boolean;
  touched: boolean;
  dirty: boolean;
} | null> {
  const bound = injectBoundControl();
  return computed(() => {
    const control = bound().control;
    return control
      ? { invalid: !!control.invalid, touched: !!control.touched, dirty: !!control.dirty }
      : null;
  });
}

/**
 * Workaround for https://github.com/angular/angular/issues/69756
 *
 * Classic forms (`ngModel`, `[formControl]`, `formControlName`) bind a
 * `FormValueControl` through `NgControl.setupCustomControl()`, which — unlike the
 * `ControlValueAccessor` path — never calls `setUpValidators()`. Validator
 * directives on the host (`required`, `minlength`, custom `NG_VALIDATORS`) are
 * thus silently dropped. This merges the directive's composed validators into
 * the bound control the way Angular's CVA path does.
 *
 * A no-op where there is nothing to fix: signal forms provide a non-`NgControl`
 * interop control, and without a validator directive on the host `validator` /
 * `asyncValidator` are `null`, so a reactive control's own validators are never
 * touched. It only adds what the control lacks (by reference), so it also steps
 * aside once Angular attaches them itself. Must be called in an injection context.
 */
export function injectNgControlValidators(): void {
  const ngControl = inject(NgControl, { optional: true, self: true });
  if (!(ngControl instanceof NgControl)) {
    return;
  }
  const { validator, asyncValidator } = ngControl;
  if (!validator && !asyncValidator) {
    return;
  }

  // The control we attached to, so a rebound `[formControl]` or destroy undoes it.
  let attached: AbstractControl | null = null;
  const detach = (): void => {
    if (!attached) {
      return;
    }
    if (validator) attached.removeValidators(validator);
    if (asyncValidator) attached.removeAsyncValidators(asyncValidator);
    attached.updateValueAndValidity();
    attached = null;
  };

  // Validator directives report input changes (e.g. `[required]="flag"`) through
  // this hook; Angular's CVA path registers it in `setUpValidators()` as well.
  const rawValidators = [
    ...(inject(NG_VALIDATORS, { optional: true, self: true }) ?? []),
    ...(inject(NG_ASYNC_VALIDATORS, { optional: true, self: true }) ?? []),
  ] as { registerOnValidatorChange?: (fn: () => void) => void }[];
  for (const raw of rawValidators) {
    raw.registerOnValidatorChange?.(() => attached?.updateValueAndValidity());
  }

  const bound = injectBoundControl();
  effect(() => {
    const control = bound().control;
    untracked(() => {
      if (control === attached) {
        return;
      }
      detach();
      if (!control) {
        return;
      }
      let added = false;
      if (validator && !control.hasValidator(validator)) {
        control.addValidators(validator);
        added = true;
      }
      if (asyncValidator && !control.hasAsyncValidator(asyncValidator)) {
        control.addAsyncValidators(asyncValidator);
        added = true;
      }
      if (added) {
        attached = control;
        control.updateValueAndValidity();
      }
    });
  });
  inject(DestroyRef).onDestroy(detach);
}

/**
 * The bound form control's current value, wrapped so "no form on the host" is
 * distinguishable from a control whose value is `null`. Reading the value here
 * also tracks signal forms, whose interop `NgControl` exposes it as a signal.
 * Must be called in an injection context.
 */
export function injectNgControlValue(): Signal<{ value: unknown } | null> {
  const bound = injectBoundControl();
  return computed(() => {
    const control = bound().control;
    return control ? { value: control.value } : null;
  });
}
