import { createThemePart, css } from '@awdlab/jig-themes/api';
import { accordionControlTemplate } from '@awdlab/jig-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css``,
  },
});
