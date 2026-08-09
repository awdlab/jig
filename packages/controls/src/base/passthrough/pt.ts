import { computed, Directive, effect, inject, input, isDevMode } from '@angular/core';
import { setInputSignalValue } from '@awdlab/jig/utils-ng';

import { JIG_CONTROL } from '../base';
import { JigPtEngine } from './pt-engine';

import type { AnyJigPassthrough } from './types';
import type { FullAnyJigBase, JigBaseSafe } from '../base';
import type { AppliedThemeClassCfg } from '@awdlab/jig/api/ng';
import type { ControlName, ControlTemplate, ThemeTemplate } from '@awdlab/jig-themes';

/** The control name backing a parent `JigBaseSafe`, or `never` for a nameless base. */
type ParentName<T> = T extends JigBaseSafe<infer A> ? (A extends null ? never : A) : never;

/**
 * Union of the NON-projected dependency-slot class tokens declared on a control's
 * theme template — i.e. the valid `[ptDep]` targets for parent control `Name`.
 * Projected slots are excluded — they have no host element to bind `[ptDep]` to,
 * so accepting them would type-check a no-op.
 */
export type DepClass<Name extends ControlName> = ThemeTemplate[Name] extends ControlTemplate
  ? Exclude<ThemeTemplate[Name]['dependencies'][number], { projected: true }>['class']
  : never;

// Internal passthrough directive; intentionally uses the non-prefixed `ptInt` selector.
@Directive({ selector: '[ptInt]' })
export class JigPt<T extends JigBaseSafe<Name>, Name extends ControlName> {
  /** The parent control whose theme/passthrough this element pulls from. */
  public readonly ptInt = input.required<T>();
  /**
   * Parent-scope class token(s) applied to this element, along with the parent's
   * `pt` slice for those classes. Use for flat theme parts of the parent.
   */
  public readonly ptClass = input<AppliedThemeClassCfg<ParentName<T>>>();
  /**
   * Dependency-slot class on the parent. Applies the parent's marker class
   * (`{parentScope}-{ptDep}`) to this element and forwards the parent's
   * `pt[ptDep]` slice into the nested control that lives on this element, so the
   * nested control resolves it against its own theme.
   */
  public readonly ptDep = input<DepClass<ParentName<T>>>();

  /**
   * The nested control hosted on THIS element (present when `ptDep` targets a
   * control). `self: true` is essential: without it the injection climbs to an
   * ancestor control (e.g. the parent that owns `[ptInt]`), and the forwarding
   * effect would then overwrite the ancestor's `pt` instead of the child's.
   */
  private readonly _self = inject(JIG_CONTROL, {
    optional: true,
    self: true,
  }) as unknown as FullAnyJigBase | null;

  /**
   * Flat class engine for `ptClass`: applies the parent's scope class(es) and the
   * matching `pt` slice to this element. A missing `ptClass` resolves to a no-op.
   */
  private readonly _classEngine = new JigPtEngine(
    this.ptInt,
    computed(() => this.ptClass() ?? ({} as AppliedThemeClassCfg<ParentName<T>>))
  );

  /**
   * Marker engine for `ptDep`: applies ONLY the parent's `{parentScope}-{ptDep}`
   * class to this element (`applyPassthrough: false`). The forwarded slice is
   * applied separately, through the nested control's own engine.
   */
  private readonly _markerEngine = new JigPtEngine(
    this.ptInt,
    computed(() => (this.ptDep() ?? {}) as AppliedThemeClassCfg<ParentName<T>>),
    { applyPassthrough: false }
  );

  /** The parent's `pt` slice for the current `ptDep` slot, or `undefined`. */
  private readonly _depSlice = computed<AnyJigPassthrough | undefined>(() => {
    const dep = this.ptDep();
    if (!dep) {
      return undefined;
    }
    const parentPt = (this.ptInt() as unknown as FullAnyJigBase).pt?.() as
      | Record<string, AnyJigPassthrough>
      | undefined;
    return parentPt?.[dep as string];
  });

  constructor() {
    const self = this._self;
    if (!self) {
      // No nested control on this element (e.g. `ptDep` on a plain element): only
      // the marker class applies; there is no child theme to forward the slice to.
      // Warn (dev only) if a `ptDep` is actually set — read it in an effect, since
      // inputs are not yet resolved in the constructor.
      if (isDevMode()) {
        effect(() => {
          if (this.ptDep()) {
            console.warn(
              '[ptDep] is set but no nested control was found on this element; the parent' +
                " dependency slice can't be forwarded. Did you forget to host a control here?"
            );
          }
        });
      }
      return;
    }
    // Forward the parent's dependency slice into the nested control's own `pt`
    // input, so the child's existing engine(s) resolve it against its theme.
    // Reactive to parent `pt` changes; torn down with the directive/child. Writes
    // on every run (even `undefined`) so a slice that disappears (e.g. `ptDep`
    // cleared) clears the child's `pt` instead of leaving it stale; the child's
    // own engine already treats a falsy `pt` as a no-op.
    effect(() => {
      setInputSignalValue(self.pt, this._depSlice());
    });
  }
}
