import type { ControlTemplate } from '@ngneers/controls-themes';
import { Prettify } from '@ngneers/controls/utils';

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

type Classes<CT extends ControlTemplate> = Record<CT['classNames'][number], string> & {
  $deps: UnionToIntersection<
    Prettify<
      CT['dependencies'] extends []
        ? CT['dependencies'][number] extends infer I
          ? I extends ControlTemplate
            ? Record<I['scope'], Classes<I>>
            : never
          : never
        : never
    >
  >;
};

export function themeClasses<CT extends ControlTemplate>(template: CT): Classes<CT> {
  const result: Classes<CT> = {} as any;

  const deps = template.dependencies?.map(dep => ({ [dep]: themeClasses(dep) }));
  if (deps) {
    result.$deps = Object.assign({}, ...deps);
  }

  const ownRes: Record<CT['classNames'][number], string> = {} as any;

  for (const className of template.classNames) {
    const key = className as CT['classNames'][number];
    ownRes[key] = `.ngn-${template.scope}${className ? '-' : ''}${className}`;
  }
  Object.assign(result, ownRes);
  return result;
}
