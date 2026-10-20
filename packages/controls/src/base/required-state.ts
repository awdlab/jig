import { computed, DestroyRef, inject, signal, type Signal } from '@angular/core';
import { type AbstractControl, FormControl, NgControl } from '@angular/forms';

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
