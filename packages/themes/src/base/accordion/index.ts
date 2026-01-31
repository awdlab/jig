import { createThemePart, css } from '@ngneers/controls-themes/api';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css``,
  },
});
