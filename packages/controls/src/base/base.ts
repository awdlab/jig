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
import { setInputSignalValue } from '@ngneers/controls/utils-ng';
import { ControlTemplate } from '@ngneers/controls-themes';

export const NGN_CONTROL = new InjectionToken<NgnBase>('NGN_CONTROL');

export function provideSelf(control: Type<NgnBase>): Provider {
  return { provide: NGN_CONTROL, useExisting: forwardRef(() => control) };
}

@Directive({
  host: { class: 'ngn-control' },
})
export abstract class NgnBase {
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

  protected injectThemeTemplate<T extends ControlTemplate>(template: T): ControlTemplateInfo<T> {
    const opts = { unstyled: this.unstyled };
    return injectThemeTemplate(template, opts);
  }
}
