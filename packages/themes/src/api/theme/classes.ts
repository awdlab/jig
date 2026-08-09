import type { ControlTemplate } from '@awdlab/jig-themes';

export type ThemeClasses<CT extends ControlTemplate> = Record<CT['classNames'][number], string> & {
  [D in CT['dependencies'][number] as D extends { projected: true }
    ? never
    : D['class']]: ThemeClasses<D['template']>;
};
