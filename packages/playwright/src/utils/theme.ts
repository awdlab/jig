import type { ControlTemplate, ThemeClasses } from '@ngneers/controls-themes';

export function themeClasses<CT extends ControlTemplate>(template: CT): ThemeClasses<CT> {
  const result: ThemeClasses<CT> = {} as any;

  const deps = template.dependencies?.map(dep => ({ [dep.scope]: themeClasses(dep) }));
  if (deps) {
    result.$deps = Object.assign({}, ...deps);
  }

  const ownRes: Record<CT['classNames'][number], string> = {} as any;

  for (const className of ['', ...template.classNames]) {
    const key = className as CT['classNames'][number];
    ownRes[key] = `.ngn-${template.scope}${className ? '-' : ''}${className}`;
  }
  Object.assign(result, ownRes);
  return result;
}
