import type { ControlTemplate } from '@ngneers/controls-themes';

export type ThemeClasses<CT extends ControlTemplate> = Record<CT['classNames'][number], string> & {
  [D in CT['dependencies'][number] as D extends { projected: true }
    ? never
    : D['class']]: ThemeClasses<D['template']>;
};
