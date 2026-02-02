import {
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
  InputSignal,
  Provider,
  signal,
  Signal,
  Type,
  viewChildren,
} from '@angular/core';
import {
  ControlTemplateInfo,
  injectThemeTemplate,
  injectThemeControlKinds,
  injectThemeColors,
  AppliedThemeClassCfg,
} from '@ngneers/controls/api/ng';
import { toggleClass } from '@ngneers/controls/utils';
import { effectWithPrevious, setInputSignalValue } from '@ngneers/controls/utils-ng';
import { CustomColor, CustomKind } from '@ngneers/controls-custom-types';
import { ControlTemplate } from '@ngneers/controls-themes';
import { ControlName, ThemeTemplate } from '@ngneers/controls-themes/templates';

import { setNgnInstance } from './ngn-instance';
import { NgnPassthrough, NgnPtEngine } from './passthrough';

export const NGN_CONTROL = new InjectionToken<NgnBase<never>>('NGN_CONTROL');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyNgnBase = NgnBaseSafe<any>;
export type NgnBaseSafe<T extends ControlName | null> = Omit<
  NgnBase<T>,
  'kind' | 'appliedKind' | 'pt'
>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FullAnyNgnBase = Omit<NgnBase<any>, 'kind' | 'appliedKind' | 'pt'> & {
  kind: InputSignal<CustomKind<any> | undefined>;
  appliedKind: InputSignal<CustomKind<any> | undefined>;
  pt: InputSignal<NgnPassthrough<any> | undefined>;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

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
  host: { class: 'ngn-control' },
})
export abstract class NgnBase<T extends ControlName | null> {
  protected abstract theme: ControlTemplateInfo<never> | null;

  private readonly _defaultKind = signal<CustomKind<T> | undefined>(undefined);
  private readonly _defaultColor = signal<CustomColor | undefined>(undefined);

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
    () => this.kind() ?? this._defaultKind()
  );
  public readonly appliedColor = computed<CustomColor | undefined>(
    () => this.color() ?? this._defaultColor()
  );

  /**
   * Custom passthrough attributes to apply to the control's theme classes and its dependencies.
   * This allows for fine-grained customization of attributes, styles and more.
   */
  public readonly pt = input<T extends string ? NgnPassthrough<T> : never>();

  private readonly _childNgnControls = viewChildren(NGN_CONTROL);
  private readonly _afterLeaveCbs: (() => void)[] = [];

  constructor() {
    setNgnInstance(this.element.nativeElement, this);
    this.prepareAfterLeaveHook();
    effect(() => {
      // Propagate unstyled state to direct child controls, does not affect
      // custom user content passed into ng-content or projected templates.
      this._childNgnControls().forEach(child => {
        setInputSignalValue(child.unstyled, this.unstyled());
      });
    });

    this.initializeKindAndColorClasses();
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
        /**
         * Recursively searches for a leave animation on the element and its parents.
         * @param element The element to search for leave animations.
         * @returns The leave animation if found, otherwise null.
         */
        function findLeaveAnimationRecursive(element: HTMLElement): Animation | null {
          const animations = element.getAnimations();
          const leaveAnimation = animations.find(
            a => a instanceof CSSAnimation && a.animationName.endsWith('-leave')
          );
          if (leaveAnimation) {
            return leaveAnimation;
          }
          if (element.parentElement) {
            return findLeaveAnimationRecursive(element.parentElement);
          }
          return null;
        }

        requestAnimationFrame(() => {
          const leaveAnimation = findLeaveAnimationRecursive(this.element.nativeElement);
          if (!leaveAnimation) {
            this.afterLeaveInternal();
          } else {
            leaveAnimation.finished
              .catch(() => {
                // ignore errors from animations being cancelled
              })
              .finally(() => {
                this.afterLeaveInternal();
              });
          }
        });
      }
    });
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

    const kinds = injectThemeControlKinds(theme.scope);
    if (kinds.length) {
      this._defaultKind.set(kinds[0] as CustomKind<T>);
    }
    const colors = injectThemeColors(theme.scope);
    if (colors.length) {
      this._defaultColor.set(colors[0] as CustomColor);
    }

    if (hostClass !== undefined) {
      new NgnPtEngine(this, hostClass);
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
