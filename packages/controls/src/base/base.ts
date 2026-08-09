import {
  afterNextRender,
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  Injector,
  input,
  type InputSignal,
  type Provider,
  signal,
  type Signal,
  Type,
  viewChildren,
} from '@angular/core';
import {
  type ControlTemplateInfo,
  injectThemeTemplate,
  injectThemeControlKinds,
  injectThemeControlDefaults,
  injectThemeColors,
  type AppliedThemeClassCfg,
  Platform,
} from '@awdlab/jig/api/ng';
import { toggleClass } from '@awdlab/jig/utils';
import { effectWithPrevious, setInputSignalValue } from '@awdlab/jig/utils-ng';

import { setAwdInstance } from './jig-instance';
import { type AwdPassthrough, AwdPtEngine } from './passthrough';

import type { CustomColor, CustomKind } from '@awdlab/jig-custom-types';
import type { ControlTemplate } from '@awdlab/jig-themes';
import type { ControlName, ThemeTemplate } from '@awdlab/jig-themes/templates';

export const NGN_CONTROL = new InjectionToken<AwdBase<never>>('NGN_CONTROL');

// eslint-disable-next-line typescript/no-explicit-any
export type AnyAwdBase = AwdBaseSafe<any>;
export type AwdBaseSafe<T extends ControlName | null> = Omit<
  AwdBase<T>,
  'kind' | 'appliedKind' | 'pt'
>;

/* eslint-disable typescript/no-explicit-any */
export type FullAnyAwdBase = Omit<AwdBase<any>, 'kind' | 'appliedKind' | 'pt'> & {
  kind: InputSignal<CustomKind<any> | undefined>;
  appliedKind: InputSignal<CustomKind<any> | undefined>;
  pt: InputSignal<AwdPassthrough<any> | undefined>;
};
/* eslint-enable typescript/no-explicit-any */

/**
 * @internal
 * Provides the control itself for dependency injection.
 * @param control - The control class to provide.
 * @returns A provider for the control itself.
 */
export function provideSelf(control: Type<unknown>): Provider {
  return { provide: NGN_CONTROL, useExisting: forwardRef(() => control) };
}

@Directive({
  host: { class: 'jig-control jig-control-initializing' },
})
export abstract class AwdBase<T extends ControlName | null> {
  protected abstract theme: ControlTemplateInfo<never> | null;

  private readonly _defaultKind = signal<CustomKind<T> | undefined>(undefined);
  private readonly _defaultColor = signal<CustomColor | undefined>(undefined);
  private readonly _kindOverride = signal<CustomKind<T> | undefined>(undefined);

  /**
   * The element reference for the host element.
   */
  public readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  /**
   * The injector for the component.
   */
  public readonly injector = inject(Injector);
  /**
   * If true, the control will not apply any theme styles.
   * The base styles of the control will still be applied.
   * @default false
   */
  public readonly unstyled = input(false, { transform: booleanAttribute });

  /**
   * Some controls support custom kinds for styling purposes.
   * The available kinds depend on the control and the theme used.
   *
   * TODO: link to custom types documentation
   */
  public readonly kind = input<CustomKind<T> | undefined>(undefined as never);
  public readonly color = input<CustomColor | undefined>(undefined as never);

  public readonly appliedKind = computed<CustomKind<T> | undefined>(
    () => this._kindOverride() ?? this.kind() ?? this._defaultKind()
  );
  public readonly appliedColor = computed<CustomColor | undefined>(
    () => this.color() ?? this._defaultColor()
  );

  /**
   * Custom passthrough attributes to apply to the control's theme classes and its dependencies.
   * This allows for fine-grained customization of attributes, styles and more.
   */
  public readonly pt = input<T extends string ? AwdPassthrough<T> : never>();

  /**
   * Marks a control as the primary value control of a surrounding field
   * (e.g. `jig-input-field`). Fields resolve their projected control by
   * filtering for this flag, so auxiliary controls placed inside the field
   * (buttons, icons, spin buttons, …) never shadow the actual input.
   * Overridden with `true` by input, mask-input, calendar, select, ….
   */
  public readonly isFieldControl: boolean = false;

  /**
   * Whether the control holds no user-entered content. Field controls override
   * this from their eager entry state — not {@link isFieldControl}'s `value`,
   * which can lag behind typing until the entry is valid (mask-input, calendar)
   * — so a wrapping `jig-input-field` can float its label reliably.
   */
  public readonly empty: Signal<boolean> = signal(false);

  /**
   * Hook for placing focus/selection from a pointer event that originated in the
   * surrounding field (or the control itself). The default does nothing and
   * returns `false`, signalling the surrounding field should fall back to its
   * primitive focusing. Controls that own internal focus placement (e.g.
   * mask-input) override this, act on the pointer location, and return `true`.
   */
  public focusFromPointer(_event: MouseEvent): boolean {
    return false;
  }

  /**
   * Hook for stepping the control's value (e.g. from `jig-spin-buttons` or
   * other external steppers). The default does nothing and returns `false`.
   * Controls with a steppable value (e.g. number-input) override this, apply
   * the step and return `true`.
   * @param _direction - `1` to increment, `-1` to decrement.
   * @param _big - Whether to apply the control's big step (e.g. Shift+Arrow).
   */
  public stepValue(_direction: 1 | -1, _big = false): boolean {
    return false;
  }

  /**
   * Hook telling external steppers (e.g. `jig-spin-buttons`) whether the value
   * can currently be stepped in the given direction. The default returns
   * `false`; controls overriding {@link stepValue} override this as well
   * (typically `false` at a min/max bound or while disabled/readonly).
   */
  public canStepValue(_direction: 1 | -1): boolean {
    return false;
  }

  /**
   * Hook for clearing the control's own value/state (e.g. from a surrounding
   * field's clear button). The default does nothing and returns `false`, so the
   * caller falls back to clearing the underlying DOM input. Controls that manage
   * their own value (e.g. mask-input) override this to reset and return `true`.
   */
  public clearValue(): boolean {
    return false;
  }

  /**
   * Temporarily overrides the authored kind without mutating the public input.
   * Intended for derived control states such as validation-driven hints.
   */
  protected setKindOverride(kind: CustomKind<T> | undefined): void {
    this._kindOverride.set(kind);
  }

  private readonly _childAwdControls = viewChildren(NGN_CONTROL);
  private readonly _afterLeaveCbs: (() => void)[] = [];

  constructor() {
    // `pt` is typed against this control's own `T`, which makes `this`
    // (AwdBase<T>) structurally incompatible with the type-erased AnyAwdBase
    // alias for an unconstrained/generic T. Safe: AnyAwdBase never reads `pt`
    // in a way that depends on the real T at the call site.
    setAwdInstance(this.element.nativeElement, this as unknown as AnyAwdBase);
    this.prepareAfterLeaveHook();
    effect(() => {
      // Propagate unstyled state to direct child controls, does not affect
      // custom user content passed into ng-content or projected templates.
      this._childAwdControls().forEach(child => {
        setInputSignalValue(child.unstyled, this.unstyled());
      });
    });

    this.initializeKindAndColorClasses();

    if (inject(Platform).isBrowser) {
      // Remove the initializing class after the first render to prevent FOUC.
      // The `write` phase runs before any `mixedReadWrite` hook, so a control that
      // reveals others on first render (a dialog calling `showModal()`) never sees
      // its children still hidden — native `autofocus` would skip them.
      afterNextRender({
        write: () => {
          this.element.nativeElement.classList.remove('jig-control-initializing');
        },
      });
    } else {
      // Remove the initializing class immediately on the server to serve a complete initial HTML.
      this.element.nativeElement.classList.remove('jig-control-initializing');
    }
  }

  /**
   * Prepares the after leave hook to be called when the control is destroyed
   * and its leave animation has finished.
   */
  private prepareAfterLeaveHook() {
    inject(DestroyRef).onDestroy(() => {
      if (typeof this.element.nativeElement.getAnimations !== 'function') {
        this.afterLeaveInternal();
      } else {
        AwdBase._enqueueLeaveCheck(this.element.nativeElement, () => this.afterLeaveInternal());
      }
    });
  }

  // --- Batched leave animation checking ---
  // Collects all destroyed components in the same frame into one queue,
  // then processes them in a single rAF to avoid layout thrashing from
  // interleaved getAnimations() calls and DOM mutations.

  private static _leaveQueue: { element: HTMLElement; callback: () => void }[] = [];
  private static _leaveRafScheduled = false;

  private static _enqueueLeaveCheck(element: HTMLElement, callback: () => void): void {
    AwdBase._leaveQueue.push({ element, callback });
    if (!AwdBase._leaveRafScheduled) {
      AwdBase._leaveRafScheduled = true;
      requestAnimationFrame(() => AwdBase._processLeaveQueue());
    }
  }

  private static _processLeaveQueue(): void {
    const queue = AwdBase._leaveQueue;
    AwdBase._leaveQueue = [];
    AwdBase._leaveRafScheduled = false;

    // Phase 1: Read all animations (batched queries — no interleaved mutations)
    const results: { animation: Animation | null; callback: () => void }[] = [];
    for (const { element, callback } of queue) {
      results.push({
        animation: AwdBase._findLeaveAnimation(element),
        callback,
      });
    }

    // Phase 2: Process results (no more style queries needed)
    for (const { animation, callback } of results) {
      if (!animation) {
        callback();
      } else {
        animation.finished
          .catch(() => {
            // ignore errors from animations being cancelled
          })
          .finally(() => {
            callback();
          });
      }
    }
  }

  /**
   * Recursively searches for a leave animation on the element and its parents.
   */
  private static _findLeaveAnimation(element: HTMLElement): Animation | null {
    const animations = element.getAnimations();
    const leaveAnimation = animations.find(
      a => a instanceof CSSAnimation && a.animationName.endsWith('-leave')
    );
    if (leaveAnimation) {
      return leaveAnimation;
    }
    if (element.parentElement) {
      return AwdBase._findLeaveAnimation(element.parentElement);
    }
    return null;
  }

  private afterLeaveInternal() {
    /**
     * After the control is hidden/removed from the DOM,
     * manually wipe the innerHTML to ensure no detached children remain
     * mapped to this component's LView slots in the browser's memory.
     * This is especially important for controls that use ng-content
     * or dynamically render child components.
     */
    this.element.nativeElement.innerHTML = '';
    this._afterLeaveCbs.forEach(cb => cb());
    this.afterLeave();
  }
  /**
   * Lifecycle hook that is called after the control has left (been removed from) the DOM.
   * Can be overridden by subclasses to perform custom actions after the leave animation.
   */
  protected afterLeave() {
    // Can be overridden by subclasses
  }

  /**
   * @internal
   */
  protected injectThemeTemplate<External extends boolean = false>(
    template: External extends true ? ControlTemplate : T extends string ? ThemeTemplate[T] : never,
    hostClass?: null extends T ? never : AppliedThemeClassCfg<T & string>
  ): ControlTemplateInfo<
    External extends true ? ControlTemplate : T extends string ? ThemeTemplate[T] : never
  > {
    const opts = { unstyled: this.unstyled };
    const theme = injectThemeTemplate(template, opts);

    const defaults = injectThemeControlDefaults(theme.scope)();
    const kinds = injectThemeControlKinds(theme.scope)();
    if (defaults.kind !== undefined) {
      this._defaultKind.set(defaults.kind as CustomKind<T>);
    } else if (kinds.length) {
      this._defaultKind.set(kinds[0] as CustomKind<T>);
    }
    const colors = injectThemeColors(theme.scope)();
    if (defaults.color !== undefined) {
      this._defaultColor.set(defaults.color as CustomColor);
    } else if (colors.length) {
      this._defaultColor.set(colors[0] as CustomColor);
    }

    if (hostClass !== undefined) {
      // See constructor comment: `this` (AwdBase<T>) isn't structurally assignable
      // to AwdBaseSafe<T & string> for a generic T because `pt`'s type still
      // depends on T. Narrow the erasure to this control's own T & string, which
      // matches what AwdPtEngine actually needs here.
      new AwdPtEngine(this as unknown as AwdBaseSafe<T & string>, hostClass);
    }

    return theme as ControlTemplateInfo<
      External extends true ? ControlTemplate : T extends string ? ThemeTemplate[T] : never
    >;
  }

  /**
   * Toggles the kind and color theme classes based on the current values of the kind and color inputs.
   */
  private initializeKindAndColorClasses() {
    this.initializeAutoThemeClasses('kind', this.appliedKind);
    this.initializeAutoThemeClasses('color', this.appliedColor);
  }

  /**
   * Initializes automatic theme class toggling for a given prefix based on the provided string signal.
   *
   * ⚠️ Caution: This method assumes that the control's theme supports classes with the given prefix.
   *
   * ⚠️ Caution: Make sure the signal provides only string or nullish values.
   *
   * @param prefix The prefix for the theme class (e.g., 'kind' or 'color').
   * @param signal The signal that provides the current string value for the theme class.
   */
  protected initializeAutoThemeClasses(prefix: string, signal: Signal<unknown | undefined>) {
    const element = this.element.nativeElement;

    type ThemeClassToken = Parameters<ControlTemplateInfo<never>['class']>[0];
    /**
     * We can't know here whether the control has any kind or color classes,
     * so we cast explicitly to ThemeClassToken. In practice, controls without
     * kind or color classes will simply not toggle any classes as the input type does not allow it.
     */
    const classToken = (value: string): ThemeClassToken => value as unknown as ThemeClassToken;

    const togglePrefixedThemeClass = (prefix: string, value: unknown, enabled: boolean): void => {
      if (!value) {
        return;
      }
      const theme = this.theme;
      if (!theme) {
        return;
      }
      toggleClass(element, theme.class(classToken(`${prefix}-${value}`)), enabled);
    };

    effectWithPrevious(signal, (current, previous) => {
      togglePrefixedThemeClass(prefix, previous, false);
      togglePrefixedThemeClass(prefix, current, true);
    });

    this._afterLeaveCbs.push(() => {
      togglePrefixedThemeClass(prefix, signal(), false);
    });
  }
}
