import {
  afterRenderEffect,
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
import { ControlTemplateInfo, injectThemeTemplate, NGN_CONFIG } from '@ngneers/controls/api/ng';
import { applyPassthrough, NgnPassthrough } from '@ngneers/controls/utils';
import { setInputSignalValue } from '@ngneers/controls/utils-ng';
import { CustomKind } from '@ngneers/controls-custom-types';
import { ControlTemplate } from '@ngneers/controls-themes';
import { ControlName, ThemeTemplate } from '@ngneers/controls-themes/templates';

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
export abstract class NgnBase<T extends ControlName | null> {
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
   *
   * @todo link to custom types documentation
   */
  public readonly kind = input<CustomKind<T>>(undefined as never);

  /**
   * Custom passthrough attributes to apply to the control's theme classes and its dependencies.
   * This allows for fine-grained customization of attributes, styles and more.
   */
  public readonly pt = input<T extends string ? NgnPassthrough<T> : never>();

  private readonly _ngnConfig = inject(NGN_CONFIG);
  private _controlTemplateInfo?: ControlTemplateInfo<T extends string ? ThemeTemplate[T] : never>;
  private _controlTemplate?: ControlTemplate;
  private readonly _childNgnControls = viewChildren(NGN_CONTROL);

  constructor() {
    effect(() => {
      // Propagate unstyled state to direct child controls, does not effect
      // custom user content passed into ng-content or projected templates.
      this._childNgnControls().forEach(child => {
        setInputSignalValue(child.unstyled, this.unstyled());
      });
    });

    afterRenderEffect(() => {
      const pt = this.pt();
      const controlTemplate = this._controlTemplate;
      const controlTemplateInfo = this._controlTemplateInfo;
      if (controlTemplate && controlTemplateInfo && pt) {
        applyPassthrough(
          this._ngnConfig,
          controlTemplate,
          controlTemplateInfo,
          pt,
          this.element.nativeElement
        );
      }
    });
  }

  /**
   * @internal
   */
  protected injectThemeTemplate<External extends boolean = false>(
    template: External extends true ? ControlTemplate : T extends string ? ThemeTemplate[T] : never,
    external?: External
  ): ControlTemplateInfo<
    External extends true ? ControlTemplate : T extends string ? ThemeTemplate[T] : never
  > {
    const opts = { unstyled: this.unstyled };
    const theme = injectThemeTemplate(template, opts);
    if (!external) {
      this._controlTemplate = template as ControlTemplate;
      this._controlTemplateInfo = theme as ControlTemplateInfo<
        T extends string ? ThemeTemplate[T] : never
      >;
    }
    return theme as ControlTemplateInfo<
      External extends true ? ControlTemplate : T extends string ? ThemeTemplate[T] : never
    >;
  }
}
