import { ControlTemplate } from '@ngneers/controls-themes';
import { ControlName, ThemeTemplate } from '@ngneers/controls-themes/templates';

import { NgnConfig } from './config';
import { ControlTemplateInfo } from './theme-service';
import { objectKeys } from '../../utils/object';

import type { ThemeClasses } from '@ngneers/controls-themes';

export type PassthroughValue = {
  $attributes?: Record<string, string>;
  $styles?: Partial<CSSStyleDeclaration>;
};

type ThemeClassToPassthrough<T> = {
  [K in keyof T]?: T[K] extends string
    ? PassthroughValue
    : K extends `$${string}`
      ? ThemeClassToPassthrough<T[K]>
      : ThemeClassToPassthrough<T[K]> & PassthroughValue;
};

export type NgnPassthrough<T extends ControlName> = T extends null
  ? never
  : ThemeTemplate[T] extends ControlTemplate
    ? ThemeClassToPassthrough<ThemeClasses<ThemeTemplate[T]>> & PassthroughValue
    : never;

/**
 * @todo @LoaderB0T
 * Redo completely. This should be done differently, maybe with providers
 * or passing down the dependencies via inputs somehow.
 */
export function applyPassthrough<T extends ControlName>(
  ngnConfig: NgnConfig,
  themeTemplate: ControlTemplate,
  themeTemplateInfo: ControlTemplateInfo<T extends string ? ThemeTemplate[T] : never>,
  passthrough: NgnPassthrough<T>,
  hostElement: HTMLElement
): void {
  if (!themeTemplateInfo || !passthrough) {
    return;
  }
  const applyToElement = (element: HTMLElement, cfg: PassthroughValue) => {
    if (cfg.$attributes) {
      for (const [attr, value] of Object.entries(cfg.$attributes)) {
        element.setAttribute(attr, value);
      }
    }
    if (cfg.$styles) {
      for (const [styleName, styleValue] of Object.entries(cfg.$styles)) {
        element.style.setProperty(styleName, styleValue as string);
      }
    }
  };

  const applyRecursively = (
    themeTemplate: ControlTemplate<any>,
    themeTemplateInfo: ControlTemplateInfo<any>,
    ptCfg: NgnPassthrough<any>,
    parentElement: HTMLElement
  ) => {
    const objKey = objectKeys(ptCfg);

    applyToElement(parentElement, ptCfg);

    for (const key of objKey) {
      if (key.startsWith('$')) {
        continue;
      }
      const selector = themeTemplateInfo.class(key);
      const element = parentElement.classList.contains(selector)
        ? parentElement
        : parentElement.querySelector<HTMLElement>(`.${selector}`);
      if (element) {
        const cfg = ptCfg[key] as PassthroughValue;
        applyToElement(element, cfg);
      }
    }
  };

  applyRecursively(
    themeTemplate,
    themeTemplateInfo,
    passthrough as NgnPassthrough<any>,
    hostElement
  );
}
