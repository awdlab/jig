import { computed, ElementRef, inject, type Signal, signal } from '@angular/core';
import {
  type ControlTemplateInfo,
  type AppliedThemeClassCfg,
  getAppliedClasses,
} from '@ngneers/controls/api/ng';
import { getPropertyIfExists, objectKeys } from '@ngneers/controls/utils';
import { classSignal, effectWithPrevious } from '@ngneers/controls/utils-ng';

import type { AnyNgnPassthrough, PassthroughValue } from './types';
import type { NgnBase, NgnBaseSafe } from '../base';
import type { ControlName, ControlTemplate } from '@ngneers/controls-themes';

export class NgnPtEngine<T extends NgnBaseSafe<Name>, Name extends ControlName> {
  private readonly pt: Signal<NgnBase<Name>>;
  private readonly ptClass: Signal<
    AppliedThemeClassCfg<T extends NgnBaseSafe<infer A> ? (A extends null ? never : A) : never>
  >;

  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

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
    const pt = this.pt()?.pt() as AnyNgnPassthrough;
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
            T extends NgnBaseSafe<infer A> ? (A extends null ? never : A) : never
          >
        >
      | AppliedThemeClassCfg<T extends NgnBaseSafe<infer A> ? (A extends null ? never : A) : never>
  ) {
    const sigPt = typeof pt === 'function' ? pt : signal(pt);
    const sigPtClass = typeof ptClass === 'function' ? ptClass : signal(ptClass);

    this.pt = sigPt as unknown as Signal<NgnBase<Name>>;
    this.ptClass = sigPtClass;

    const classes = computed(() => this.classes().map(c => c.class));
    classSignal(this._elementRef.nativeElement, classes);

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
    });
  }

  private setNewPtValues(classPt: PassthroughValue) {
    if (classPt.$styles) {
      const keys = objectKeys(classPt.$styles);
      keys.forEach(key => {
        this._elementRef.nativeElement.style[key as any] = (classPt.$styles?.[key] as string) || '';
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
  }

  private removePreviousPtValues(classPt: PassthroughValue) {
    if (classPt.$styles) {
      const keys = objectKeys(classPt.$styles);
      keys.forEach(key => {
        this._elementRef.nativeElement.style[key as any] = '';
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
  }
}
