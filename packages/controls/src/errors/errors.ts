import { computed, Directive, effect, inject, input, type Signal } from '@angular/core';
import type { ValidationErrors } from '@angular/forms';
import { AwdHint } from '@awdlab/jig/hint';
import { I18n } from '@awdlab/jig/i18n';

import { injectAwdControlState } from './control-state';
import {
  carriedMessage,
  injectAwdErrorsMessages,
  isRecord,
  paramsFromValue,
  resolveUserMessage,
} from './messages';

import type {
  AwdError,
  AwdErrorsCustom,
  AwdErrorsCustomEntry,
  AwdErrorsMessageContext,
  AwdErrorsMessages,
  AwdErrorsMode,
  AwdErrorsShowOn,
  AwdErrorsSource,
  AwdErrorsState,
} from './types';

/**
 * Resolves validation errors for the control it sits on and exposes them as
 * normalized, message-mapped signals — ready to bridge into an {@link AwdHint}
 * via {@link AwdErrors.ngnErrorsHint}.
 *
 * Which form paradigm is in play is abstracted away by {@link injectAwdControlState}:
 * template-driven (`ngModel`), reactive (`formControl` / `formControlName`) and
 * signal forms (`[formField]`) all surface as one reactive state, including
 * relevant parent-group errors and a no-form `touched` fallback.
 *
 * `ngnErrorsCustom` layers on additional errors independently of any form, and
 * {@link AwdErrors.ngnErrorsShowOn} controls when messages surface (defaults to
 * `touched`). Error keys map onto the shared message table; signal-forms
 * `minLength` / `maxLength` kinds have their own table entries alongside the
 * classic lowercase `minlength` / `maxlength`.
 *
 * @category control
 */
@Directive({
  selector: '[ngnErrors]',
  exportAs: 'ngnErrors',
})
export class AwdErrors {
  /**
   * Hint instance that receives the resolved validation state.
   * @category inputs
   */
  public readonly ngnErrorsHint = input<AwdHint | undefined>();

  /**
   * Interaction state that controls when errors become visible.
   * @category inputs
   */
  public readonly ngnErrorsShowOn = input<AwdErrorsShowOn>('touched');

  /**
   * Whether to show the first matching error or all messages.
   * @category inputs
   */
  public readonly ngnErrorsMode = input<AwdErrorsMode>('first');

  /**
   * Per-instance messages that override globally provided defaults.
   * @category inputs
   */
  public readonly ngnErrorsMessages = input<AwdErrorsMessages | null>(null);

  /**
   * Additional errors supplied independently of Angular form validation.
   * @category inputs
   */
  public readonly ngnErrorsCustom = input<AwdErrorsCustom>(null);

  /** Paradigm-agnostic view of the host control (see {@link injectAwdControlState}). */
  private readonly _state = injectAwdControlState();
  private readonly _i18n = inject(I18n).translations;
  private readonly _globalMessages = injectAwdErrorsMessages();

  public readonly errors: Signal<readonly AwdError[]> = computed(() => [
    ...this._normalizeErrors(this._state.errors(), 'control'),
    ...this._normalizeGroupErrors(),
    ...this._normalizeCustomErrors(),
  ]);

  public readonly firstError = computed(() => this.errors()[0] ?? null);

  public readonly pending = computed(() => this._state.pending());

  /**
   * Whether the i18n error defaults are loaded. Probes a core key that every
   * locale defines — until the async translation import lands, `_translate`
   * echoes the key path back, which this detects.
   */
  private readonly _i18nReady = computed(() => this._translate('required', {}) !== undefined);

  /**
   * Whether display should wait: some visible error depends on the i18n default
   * (no instance / carried / global message) and translations aren't loaded yet.
   */
  private readonly _awaitingI18n = computed(
    () => !this._i18nReady() && this.errors().some(error => this._dependsOnI18n(error))
  );

  public readonly visible = computed(() => {
    if (!this.errors().length && !this.pending()) {
      return false;
    }

    // Hold error display until the i18n defaults have loaded, so a default
    // message never flashes as its raw key ("required") before the async
    // translation import lands. Only affects errors with no instance/carried/
    // global message (those show immediately); pending always shows (it has a
    // hardcoded fallback). See {@link _awaitingI18n}.
    if (!this.pending() && this._awaitingI18n()) {
      return false;
    }

    switch (this.ngnErrorsShowOn()) {
      case 'always':
        return true;
      case 'never':
        return false;
      case 'dirty':
        return this._state.dirty();
      case 'submitted':
        return this._state.submitted();
      case 'touched':
      default:
        return this._state.touched();
    }
  });

  public readonly message = computed(() => {
    if (!this.visible()) {
      return null;
    }

    if (this.pending()) {
      return this._translate('pending', {}) ?? 'Validating...';
    }

    const errors = this.errors();
    if (this.ngnErrorsMode() === 'all') {
      return errors.map(error => error.message).join('\n') || null;
    }

    return errors[0]?.message ?? null;
  });

  public readonly state: Signal<AwdErrorsState> = computed(() => ({
    visible: this.visible(),
    pending: this.pending(),
    errors: this.errors(),
    firstError: this.firstError(),
    message: this.message(),
  }));

  constructor() {
    // `ngnErrors` renders the error *message* only — it never touches invalid
    // styling. The control owns its invalid border (via its own `invalidOn`
    // trigger), and the input field mirrors its child. See {@link AwdErrors}.
    effect(() => {
      this.ngnErrorsHint()?.setValidationState(this.state());
    });
  }

  private _normalizeGroupErrors(): readonly AwdError[] {
    return this._normalizeErrors(this._state.parentErrors(), 'group').filter(error =>
      this._isGroupErrorRelevant(error.value)
    );
  }

  private _normalizeCustomErrors(): readonly AwdError[] {
    const errors = this.ngnErrorsCustom();
    if (!errors) {
      return [];
    }

    if (Array.isArray(errors)) {
      return errors.map(error =>
        typeof error === 'string'
          ? this._createError(error, true, 'custom')
          : this._createCustomEntryError(error)
      );
    }

    return this._normalizeErrors(errors, 'custom');
  }

  private _normalizeErrors(
    errors: ValidationErrors | null | undefined,
    source: AwdErrorsSource
  ): readonly AwdError[] {
    if (!errors) {
      return [];
    }

    return Object.entries(errors).map(([key, value]) => this._createError(key, value, source));
  }

  private _createCustomEntryError(error: AwdErrorsCustomEntry): AwdError {
    const value = error.value ?? true;
    const params = error.params ?? paramsFromValue(value);
    const context: AwdErrorsMessageContext = { key: error.key, value, source: 'custom', params };
    const message = error.message ?? this._resolveMessage(context);

    return { key: error.key, value, source: 'custom', params, message };
  }

  private _createError(key: string, value: unknown, source: AwdErrorsSource): AwdError {
    const params = paramsFromValue(value);
    const context: AwdErrorsMessageContext = { key, value, source, params };

    return { key, value, source, params, message: this._resolveMessage(context) };
  }

  /**
   * Resolves a display message for an error, in priority order:
   * per-instance {@link ngnErrorsMessages} → a message carried on the error
   * itself → globally provided messages → the i18n `errors.*` default → the key.
   */
  private _resolveMessage(context: AwdErrorsMessageContext): string {
    return (
      resolveUserMessage(context, this.ngnErrorsMessages() ?? {}) ??
      carriedMessage(context.value) ??
      resolveUserMessage(context, this._globalMessages) ??
      this._translate(context.key, context.params) ??
      context.key
    );
  }

  /**
   * Whether an error's message can only come from the i18n default (or the raw
   * key fallback) — i.e. no per-instance, carried, or global message applies.
   * Such errors are held from display until translations load (see
   * {@link _awaitingI18n}); all others show immediately.
   */
  private _dependsOnI18n(error: AwdError): boolean {
    const context: AwdErrorsMessageContext = {
      key: error.key,
      value: error.value,
      source: error.source,
      params: error.params,
    };
    return (
      resolveUserMessage(context, this.ngnErrorsMessages() ?? {}) === undefined &&
      carriedMessage(context.value) === undefined &&
      resolveUserMessage(context, this._globalMessages) === undefined
    );
  }

  /**
   * Looks up the i18n `errors.<key>` default, interpolating the error params.
   * Returns `undefined` when the key is unknown or translations aren't loaded —
   * `signal-translate` echoes the flat path back in that case, which we detect.
   */
  private _translate(key: string, params: Record<string, unknown>): string | undefined {
    const path = `errors_${key}`;
    const message = this._i18n._unsafe[path]?.(params);
    return message === undefined || message === path ? undefined : message;
  }

  private _isGroupErrorRelevant(value: unknown): boolean {
    const name = this._state.name;
    if (name === null || name === undefined || !isRecord(value)) {
      return false;
    }

    const controlName = String(name);
    return (
      hasMatchingName(value['control'], controlName) ||
      hasMatchingName(value['controlName'], controlName) ||
      hasMatchingName(value['field'], controlName) ||
      hasMatchingName(value['controls'], controlName) ||
      hasMatchingName(value['controlNames'], controlName) ||
      hasMatchingName(value['fields'], controlName)
    );
  }
}

function hasMatchingName(value: unknown, controlName: string): boolean {
  if (Array.isArray(value)) {
    return value.some(item => hasMatchingName(item, controlName));
  }
  if (value === null || value === undefined || isRecord(value)) {
    return false;
  }
  return String(value) === controlName;
}
