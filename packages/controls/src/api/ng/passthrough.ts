import { ControlTemplate } from '@ngneers/controls-themes';
import { ControlName, ThemeTemplate } from '@ngneers/controls-themes/templates';

import { NgnConfig } from './config';
import { ControlTemplateInfo } from './theme-service';

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
}
