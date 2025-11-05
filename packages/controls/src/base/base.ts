import {
  Directive,
  effect,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  Injector,
  input,
  Provider,
  Type,
  viewChildren,
} from '@angular/core';
import { ControlTemplateInfo, injectThemeTemplate } from '@ngneers/controls/api/ng';
import { CustomKind } from '@ngneers/controls/custom-types';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';
import { ControlTemplate } from '@ngneers/controls-themes';

export const NGN_CONTROL = new InjectionToken<NgnBase<never>>('NGN_CONTROL');

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
export abstract class NgnBase<T extends string | null> {
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
   *
   * ⚠️ Caution: This property is *not* reactive and has to be set before the control starts rendering.
   * @default false
   */
  public readonly unstyled = input(false);

  /**
   * Some controls support custom kinds for styling purposes.
   * The available kinds depend on the control and the theme used.
   * If your theme does not provide typings for custom kinds, this defaults to `string`.
   * If the control does not support custom kinds, this is `never` and cannot be set.
   * You can extend the available kinds by augmenting the `NgnCustomTypes` interface in `@ngneers/controls/custom-types`.
   * @todo link to custom types documentation
   */
  public readonly kind = input<CustomKind<T>>(undefined as never);

  private readonly _childNgnControls = viewChildren(NGN_CONTROL);
  constructor() {
    effect(() => {
      // Propagate unstyled state to direct child controls, does not effect
      // custom user content passed into ng-content or projected templates.
      this._childNgnControls().forEach(child => {
        setInputSignalValue(child.unstyled, this.unstyled());
      });
    });
  }

  /**
   * @internal
   */
  protected injectThemeTemplate<T extends ControlTemplate>(template: T): ControlTemplateInfo<T> {
    const opts = { unstyled: this.unstyled };
    return injectThemeTemplate(template, opts);
  }
}
