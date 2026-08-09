import type { ControlName, ControlTemplate, ThemeClasses, ThemeTemplate } from '@awdlab/jig-themes';

type EventListenerMap = {
  [K in keyof GlobalEventHandlersEventMap]: (event: GlobalEventHandlersEventMap[K]) => void;
};

export type PassthroughValue = {
  $attributes?: Record<string, string>;
  $styles?: Partial<CSSStyleDeclaration>;
  $classes?: string | string[];
  $listeners?: Partial<EventListenerMap>;
};

type ThemeClassToPassthrough<T> = {
  [K in keyof T]?: T[K] extends string
    ? PassthroughValue
    : ThemeClassToPassthrough<T[K]> & PassthroughValue;
};

export type AwdPassthrough<T extends ControlName> = T extends null
  ? never
  : ThemeTemplate[T] extends ControlTemplate
    ? ThemeClassToPassthrough<ThemeClasses<ThemeTemplate[T]>> & PassthroughValue
    : never;

// eslint-disable-next-line typescript/no-explicit-any
export type AnyAwdPassthrough = AwdPassthrough<any>;
