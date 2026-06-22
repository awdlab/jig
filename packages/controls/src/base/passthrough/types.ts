import type {
  ControlName,
  ControlTemplate,
  ThemeClasses,
  ThemeTemplate,
} from '@ngneers/controls-themes';

export type PassthroughValue = {
  $attributes?: Record<string, string>;
  $styles?: Partial<CSSStyleDeclaration>;
  $classes?: string | string[];
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

// eslint-disable-next-line ts/no-explicit-any
export type AnyNgnPassthrough = NgnPassthrough<any>;
