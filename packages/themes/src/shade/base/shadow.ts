import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

export const shadowTemplate = createVariableTemplate({
  scope: 'shadow',
  variables: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
});

// NOTE: The template keeps nova's `sm/md/lg/xl` keys, but the values are the Tailwind/shadcn
// scale shifted one step: shade `sm` = shadcn `shadow-xs`, `md` = `shadow-sm`,
// `lg` = `shadow-md`, `xl` = `shadow-lg`. Pick keys by that mapping, not by the shadcn name.
export const shadow = createThemePart({
  scope: 'shadow',
  variables: [shadowTemplate],
  root: {
    values: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      lg: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      xl: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
  },
});
