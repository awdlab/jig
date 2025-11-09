import type { ControlTemplate } from '@ngneers/controls-themes';

type Prettify<T> = { [K in keyof T]: T[K] } & {};
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

export type ThemeClasses<CT extends ControlTemplate> = Record<
  CT['classNames'][number] | '',
  string
> & {
  $deps: UnionToIntersection<
    Prettify<
      CT['dependencies'][number] extends infer Dep
        ? Dep extends ControlTemplate<infer I>
          ? Record<I, ThemeClasses<Dep>>
          : never
        : never
    >
  >;
};
