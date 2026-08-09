import { computed, DestroyRef, ElementRef, inject, type Signal, signal } from '@angular/core';
import {
  type ControlTemplateInfo,
  type AppliedThemeClassCfg,
  getAppliedClasses,
} from '@awdlab/jig/api/ng';
import { getPropertyIfExists, objectKeys } from '@awdlab/jig/utils';
import { classSignal, effectWithPrevious } from '@awdlab/jig/utils-ng';

import type { AnyAwdPassthrough, PassthroughValue } from './types';
import type { AwdBase, AwdBaseSafe } from '../base';
import type { ControlName, ControlTemplate } from '@awdlab/jig-themes';

/** Writable, string-valued properties of `CSSStyleDeclaration` (the camelCase CSS properties). */
type WritableStyleKey = Extract<keyof CSSStyleDeclaration, string> &
  {
    [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never;
  }[keyof CSSStyleDeclaration];

export class AwdPtEngine<T extends AwdBaseSafe<Name>, Name extends ControlName> {
  private readonly pt: Signal<AwdBase<Name>>;
  private readonly ptClass: Signal<
    AppliedThemeClassCfg<T extends AwdBaseSafe<infer A> ? (A extends null ? never : A) : never>
  >;

  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);

  /** The passthrough values currently applied to the element, for teardown on destroy. */
  private _currentAppliedPts: ReturnType<AwdPtEngine<T, Name>['_appliedPts']>;

  private readonly classes = computed(() => {
    const pt = this.pt();
    if ('theme' in pt) {
      const theme = pt['theme'] as ControlTemplateInfo<ControlTemplate<Name>>;
      const res = getAppliedClasses(this.ptClass(), theme);
      return res;
    }
    return [];
  });

  private readonly _appliedPts = computed(() => {
    const pt = this.pt()?.pt() as AnyAwdPassthrough;
    if (!pt) {
      return;
    }
    const classes = this.classes();
    return classes.map(({ name: ptClass }) => {
      const classPt = getPropertyIfExists(pt, ptClass);
      return classPt;
    });
  });

  constructor(
    pt: Signal<T> | T,
    ptClass:
      | Signal<
          AppliedThemeClassCfg<
            T extends AwdBaseSafe<infer A> ? (A extends null ? never : A) : never
          >
        >
      | AppliedThemeClassCfg<T extends AwdBaseSafe<infer A> ? (A extends null ? never : A) : never>,
    options?: {
      /**
       * When `false`, the engine only toggles the resolved theme class(es) on the
       * element and does NOT apply the control's `pt` slice (styles/attributes/
       * classes/listeners) for those classes. Used for dependency-slot markers,
       * where the forwarded passthrough is applied through the nested control's
       * own engine rather than flatly on the host. Defaults to `true`.
       */
      applyPassthrough?: boolean;
    }
  ) {
    const sigPt = typeof pt === 'function' ? pt : signal(pt);
    const sigPtClass = typeof ptClass === 'function' ? ptClass : signal(ptClass);

    this.pt = sigPt as unknown as Signal<AwdBase<Name>>;
    this.ptClass = sigPtClass;

    const classes = computed(() => this.classes().map(c => c.class));
    classSignal(this._elementRef.nativeElement, classes);

    if (options?.applyPassthrough === false) {
      return;
    }

    effectWithPrevious(this._appliedPts, (current, previous) => {
      if (previous) {
        for (const classPt of previous) {
          if (!classPt) {
            continue;
          }
          this.removePreviousPtValues(classPt);
        }
      }
      if (current) {
        for (const classPt of current) {
          if (!classPt) {
            continue;
          }
          this.setNewPtValues(classPt);
        }
      }
      this._currentAppliedPts = current;
    });

    // Detach applied passthrough (notably event listeners) when the element is
    // destroyed, so nothing leaks past the control's lifetime.
    this._destroyRef.onDestroy(() => {
      if (!this._currentAppliedPts) {
        return;
      }
      for (const classPt of this._currentAppliedPts) {
        if (!classPt) {
          continue;
        }
        this.removePreviousPtValues(classPt);
      }
    });
  }

  private setNewPtValues(classPt: PassthroughValue) {
    if (classPt.$styles) {
      const keys = objectKeys(classPt.$styles);
      keys.forEach(key => {
        this._elementRef.nativeElement.style[key as WritableStyleKey] =
          (classPt.$styles?.[key] as string) || '';
      });
    }
    if (classPt.$attributes) {
      const keys = objectKeys(classPt.$attributes);
      keys.forEach(key => {
        this._elementRef.nativeElement.setAttribute(
          key as string,
          (classPt.$attributes?.[key] as string) || ''
        );
      });
    }
    if (classPt.$classes) {
      const arrayOfClasses = Array.isArray(classPt.$classes)
        ? classPt.$classes.flatMap(c => c.split(' '))
        : classPt.$classes.split(' ');
      arrayOfClasses.forEach(cls => {
        try {
          this._elementRef.nativeElement.classList.add(cls);
        } catch {
          console.warn(`Could not add class '${cls}' to element`, this._elementRef.nativeElement);
        }
      });
    }
    if (classPt.$listeners) {
      objectKeys(classPt.$listeners).forEach(eventName => {
        const handler = classPt.$listeners?.[eventName];
        if (!handler) {
          return;
        }
        this._elementRef.nativeElement.addEventListener(eventName, handler as any);
      });
    }
  }

  private removePreviousPtValues(classPt: PassthroughValue) {
    if (classPt.$styles) {
      const keys = objectKeys(classPt.$styles);
      keys.forEach(key => {
        this._elementRef.nativeElement.style[key as WritableStyleKey] = '';
      });
    }
    if (classPt.$attributes) {
      const keys = objectKeys(classPt.$attributes);
      keys.forEach(key => {
        this._elementRef.nativeElement.removeAttribute(key as string);
      });
    }
    if (classPt.$classes) {
      const arrayOfClasses = Array.isArray(classPt.$classes)
        ? classPt.$classes.flatMap(c => c.split(' '))
        : classPt.$classes.split(' ');
      arrayOfClasses.forEach(cls => {
        try {
          this._elementRef.nativeElement.classList.remove(cls);
        } catch {
          console.warn(
            `Could not remove class '${cls}' from element`,
            this._elementRef.nativeElement
          );
        }
      });
    }
    if (classPt.$listeners) {
      objectKeys(classPt.$listeners).forEach(eventName => {
        const listener = classPt.$listeners?.[eventName];
        if (!listener) {
          return;
        }
        this._elementRef.nativeElement.removeEventListener(eventName, listener as any);
      });
    }
  }
}
