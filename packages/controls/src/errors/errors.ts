import {
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  signal,
  type Signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  NgControl,
  type ValidationErrors,
} from '@angular/forms';
import { NGN_CONTROL, type FullAnyNgnBase } from '@ngneers/controls/base';
import { NgnHint } from '@ngneers/controls/hint';

import {
  defaultNgnErrorsMessages,
  injectNgnErrorsMessages,
  isRecord,
  paramsFromValue,
  resolveNgnErrorMessage,
} from './messages';

import type {
  NgnError,
  NgnErrorsCustom,
  NgnErrorsCustomEntry,
  NgnErrorsMessages,
  NgnErrorsMode,
  NgnErrorsShowOn,
  NgnErrorsSource,
  NgnErrorsState,
} from './types';

@Directive({
  selector: '[ngnErrors]',
  exportAs: 'ngnErrors',
})
export class NgnErrors {
  /**
   * Hint instance that receives the resolved validation state.
   * @category inputs
   */
  public readonly ngnErrorsHint = input<NgnHint | undefined>();

  /**
   * Interaction state that controls when errors become visible.
   * @category inputs
   */
  public readonly ngnErrorsShowOn = input<NgnErrorsShowOn>('touched');

  /**
   * Whether to show the first matching error or all messages.
   * @category inputs
   */
  public readonly ngnErrorsMode = input<NgnErrorsMode>('first');

  /**
   * Per-instance messages that override globally provided defaults.
   * @category inputs
   */
  public readonly ngnErrorsMessages = input<NgnErrorsMessages | null>(null);

  /**
   * Additional errors supplied independently of Angular form validation.
   * @category inputs
   */
  public readonly ngnErrorsCustom = input<NgnErrorsCustom>(null);

  private readonly _ngControl = inject(NgControl, { optional: true, self: true });
  private readonly _selfContainer = inject(ControlContainer, { optional: true, self: true });
  private readonly _parentContainer = inject(ControlContainer, { optional: true, skipSelf: true });
  private readonly _ngnControl = inject(NGN_CONTROL, {
    optional: true,
    self: true,
  }) as FullAnyNgnBase | null;
  private readonly _globalMessages = injectNgnErrorsMessages();
  private readonly _version = signal(0);

  public readonly errors: Signal<readonly NgnError[]> = computed(() => {
    this._version();

    const messages = {
      ...defaultNgnErrorsMessages,
      ...this._globalMessages,
      ...this.ngnErrorsMessages(),
    };

    return [
      ...this._normalizeErrors(this._hostControl()?.errors, 'control', messages),
      ...this._normalizeGroupErrors(messages),
      ...this._normalizeCustomErrors(messages),
    ];
  });

  public readonly firstError = computed(() => this.errors()[0] ?? null);

  public readonly pending = computed(() => {
    this._version();
    return this._hostControl()?.pending ?? false;
  });

  public readonly visible = computed(() => {
    if (!this.errors().length && !this.pending()) {
      return false;
    }

    const control = this._hostControl();
    const showOn = this.ngnErrorsShowOn();

    switch (showOn) {
      case 'always':
        return true;
      case 'never':
        return false;
      case 'dirty':
        return control?.dirty ?? readNgnBoolean(this._ngnControl, 'dirty');
      case 'submitted':
        return this._submitted();
      case 'touched':
      default:
        return control?.touched ?? readNgnBoolean(this._ngnControl, 'touched');
    }
  });

  public readonly message = computed(() => {
    if (!this.visible()) {
      return null;
    }

    if (this.pending()) {
      return 'Validating...';
    }

    const errors = this.errors();
    if (this.ngnErrorsMode() === 'all') {
      return errors.map(error => error.message).join('\n') || null;
    }

    return errors[0]?.message ?? null;
  });

  public readonly state: Signal<NgnErrorsState> = computed(() => ({
    visible: this.visible(),
    pending: this.pending(),
    errors: this.errors(),
    firstError: this.firstError(),
    message: this.message(),
  }));

  constructor() {
    const destroyRef = inject(DestroyRef);

    queueMicrotask(() => {
      const controls = new Set(
        [this._hostControl(), this._parentControl(), this._rootControl()].filter(
          (control): control is AbstractControl => !!control
        )
      );
      for (const control of controls) {
        this._watchControl(control, destroyRef);
      }
    });

    effect(() => {
      this.ngnErrorsHint()?.setValidationState(this.state());
    });
  }

  private _watchControl(control: AbstractControl | null | undefined, destroyRef: DestroyRef): void {
    if (!control) {
      return;
    }

    const markChanged = () => this._version.update(value => value + 1);
    const statusSubscription = control.statusChanges?.subscribe(markChanged);
    const valueSubscription = control.valueChanges?.subscribe(markChanged);
    const eventsSubscription = (control as ControlWithEvents).events?.subscribe(markChanged);

    destroyRef.onDestroy(() => {
      statusSubscription?.unsubscribe();
      valueSubscription?.unsubscribe();
      eventsSubscription?.unsubscribe();
    });

    markChanged();
  }

  private _hostControl(): AbstractControl | null {
    return this._ngControl?.control ?? this._selfContainer?.control ?? null;
  }

  private _parentControl(): AbstractControl | null {
    return this._ngControl?.control?.parent ?? this._parentContainer?.control ?? null;
  }

  private _rootControl(): AbstractControl | null {
    return this._hostControl()?.root ?? this._parentControl()?.root ?? null;
  }

  private _submittedSource(): { submitted?: boolean } | null {
    const formDirective =
      this._selfContainer?.formDirective ?? this._parentContainer?.formDirective;
    return (formDirective ?? this._selfContainer ?? this._parentContainer) as {
      submitted?: boolean;
    } | null;
  }

  private _submitted(): boolean {
    return this._submittedSource()?.submitted ?? false;
  }

  private _normalizeGroupErrors(messages: NgnErrorsMessages): readonly NgnError[] {
    const parent = this._parentControl();
    const host = this._hostControl();
    if (!parent || parent === host) {
      return [];
    }

    return this._normalizeErrors(parent.errors, 'group', messages).filter(error =>
      this._isGroupErrorRelevant(error.value)
    );
  }

  private _normalizeCustomErrors(messages: NgnErrorsMessages): readonly NgnError[] {
    const errors = this.ngnErrorsCustom();
    if (!errors) {
      return [];
    }

    if (Array.isArray(errors)) {
      return errors.map(error => {
        if (typeof error === 'string') {
          return this._createError(error, true, 'custom', messages);
        }
        return this._createCustomEntryError(error, messages);
      });
    }

    return this._normalizeErrors(errors, 'custom', messages);
  }

  private _normalizeErrors(
    errors: ValidationErrors | null | undefined,
    source: NgnErrorsSource,
    messages: NgnErrorsMessages
  ): readonly NgnError[] {
    if (!errors) {
      return [];
    }

    return Object.entries(errors).map(([key, value]) =>
      this._createError(key, value, source, messages)
    );
  }

  private _createCustomEntryError(
    error: NgnErrorsCustomEntry,
    messages: NgnErrorsMessages
  ): NgnError {
    const value = error.value ?? true;
    const params = error.params ?? paramsFromValue(value);
    const message =
      error.message ??
      resolveNgnErrorMessage(
        {
          key: error.key,
          value,
          source: 'custom',
          params,
        },
        messages
      );

    return {
      key: error.key,
      value,
      source: 'custom',
      params,
      message,
    };
  }

  private _createError(
    key: string,
    value: unknown,
    source: NgnErrorsSource,
    messages: NgnErrorsMessages
  ): NgnError {
    const params = paramsFromValue(value);

    return {
      key,
      value,
      source,
      params,
      message: resolveNgnErrorMessage({ key, value, source, params }, messages),
    };
  }

  private _isGroupErrorRelevant(value: unknown): boolean {
    const name = this._ngControl?.name;
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

interface ControlWithEvents {
  events?: { subscribe: (next: () => void) => { unsubscribe: () => void } };
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

function readNgnBoolean(control: FullAnyNgnBase | null, key: 'dirty' | 'touched'): boolean {
  const value = control?.[key as keyof FullAnyNgnBase];
  return typeof value === 'function' ? Boolean((value as () => unknown)()) : Boolean(value);
}
