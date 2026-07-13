import type {
  ControlName,
  ControlTemplate,
  ThemeClasses,
  ThemeTemplate,
} from '@ngneers/controls-themes';

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

export type NgnPassthrough<T extends ControlName> = T extends null
  ? never
  : ThemeTemplate[T] extends ControlTemplate
    ? ThemeClassToPassthrough<ThemeClasses<ThemeTemplate[T]>> & PassthroughValue
    : never;

// eslint-disable-next-line typescript/no-explicit-any
export type AnyNgnPassthrough = NgnPassthrough<any>;
