import { computed, DestroyRef, inject, type OutputRef, signal, type Signal } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  NgControl,
  type ValidationErrors,
} from '@angular/forms';
import { NGN_CONTROL, type FullAnyNgnBase } from '@awdlab/jig/base';

/**
 * A paradigm-agnostic, reactive view of the form control sitting on the host
 * element — the compatibility layer `ngnErrors` reads so it never has to branch
 * on which form paradigm is in play.
 *
 * Angular 22 has no single signal API spanning the three paradigms, so this
 * bridges them onto one shape:
 * - **Reactive** (`formControl` / `formControlName`) and **template-driven**
 *   (`ngModel`) both expose an `NgControl` → `AbstractControl`.
 * - **Signal forms** (`[formField]`) provide the same `NgControl` via interop,
 *   backed by the field's `errors()` / `touched()` / `dirty()` / `pending()`.
 * - **No form**: there is no `AbstractControl`, so `touched` falls back to the
 *   control's own `touched` signal (also reflecting an external `[touched]`
 *   binding), OR-ed with its `touch` output (blur) for controls that only report
 *   blur that way.
 *
 * `AbstractControl` isn't signal-based; its single `events` stream (value /
 * status / touched / pristine) is the one subscription that keeps these signals
 * live — replacing separate `valueChanges` + `statusChanges` watches.
 */
export interface NgnControlState {
  /** Host control name, used to match relevant parent/group errors. */
  readonly name: string | number | null;
  /** Validation errors of the host control (all paradigms), or `null`. */
  readonly errors: Signal<ValidationErrors | null>;
  /** Validation errors of the parent group, when distinct from the host. */
  readonly parentErrors: Signal<ValidationErrors | null>;
  readonly touched: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly pending: Signal<boolean>;
  readonly submitted: Signal<boolean>;
}

interface ControlWithEvents {
  events?: { subscribe: (next: () => void) => { unsubscribe: () => void } };
}

/**
 * Resolves and reactively tracks the {@link NgnControlState} of the host
 * element. Must be called in an injection context (field/directive constructor).
 */
export function injectNgnControlState(): NgnControlState {
  const ngControl = inject(NgControl, { optional: true, self: true });
  const selfContainer = inject(ControlContainer, { optional: true, self: true });
  const parentContainer = inject(ControlContainer, { optional: true, skipSelf: true });
  const ngnControl = inject(NGN_CONTROL, { optional: true, self: true }) as FullAnyNgnBase | null;
  const destroyRef = inject(DestroyRef);

  const revision = signal(0);
  const bump = (): void => revision.update(value => value + 1);

  const host = (): AbstractControl | null => ngControl?.control ?? selfContainer?.control ?? null;
  const parent = (): AbstractControl | null =>
    ngControl?.control?.parent ?? parentContainer?.control ?? null;
  const root = (): AbstractControl | null => host()?.root ?? parent()?.root ?? null;

  // No-form touched: prefer the control's own `touched` signal (also reflects an
  // external `[touched]` binding), and honor a `touch` output emission (blur) for
  // controls that report blur only that way.
  const touchedFromOutput = signal(false);
  const touch = (ngnControl as { touch?: OutputRef<void> } | null)?.touch;
  const touchSubscription = touch?.subscribe(() => touchedFromOutput.set(true));
  if (touchSubscription) {
    destroyRef.onDestroy(() => touchSubscription.unsubscribe());
  }
  const touchedFallback = (): boolean => {
    const value = (ngnControl as { touched?: unknown } | null)?.touched;
    const fromSignal =
      typeof value === 'function' ? Boolean((value as () => unknown)()) : Boolean(value);
    return fromSignal || touchedFromOutput();
  };

  // Controls resolve their `AbstractControl` after the value accessor registers,
  // so defer a microtask, then watch each distinct control's unified `events`.
  queueMicrotask(() => {
    const controls = new Set(
      [host(), parent(), root()].filter((control): control is AbstractControl => !!control)
    );
    for (const control of controls) {
      const subscription = (control as ControlWithEvents).events?.subscribe(bump);
      if (subscription) {
        destroyRef.onDestroy(() => subscription.unsubscribe());
      }
    }
    bump();
  });

  const submitted = (): boolean => {
    const formDirective = selfContainer?.formDirective ?? parentContainer?.formDirective;
    const source = (formDirective ?? selfContainer ?? parentContainer) as {
      submitted?: boolean;
    } | null;
    return source?.submitted ?? false;
  };

  const dirtyFallback = (): boolean => {
    const value = (ngnControl as { dirty?: unknown } | null)?.dirty;
    return typeof value === 'function' ? Boolean((value as () => unknown)()) : Boolean(value);
  };

  return {
    name: ngControl?.name ?? null,
    errors: computed(() => (revision(), host()?.errors ?? null)),
    parentErrors: computed(() => {
      revision();
      const parentControl = parent();
      return parentControl && parentControl !== host() ? (parentControl.errors ?? null) : null;
    }),
    touched: computed(() => (revision(), host()?.touched ?? touchedFallback())),
    dirty: computed(() => (revision(), host()?.dirty ?? dirtyFallback())),
    pending: computed(() => (revision(), host()?.pending ?? false)),
    submitted: computed(() => (revision(), submitted())),
  };
}
