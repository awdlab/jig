import type { ControlTemplate, ThemeClasses } from '@ngneers/controls-themes';
import type { ControlName, ThemeTemplate } from '@ngneers/controls-themes/templates';

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
