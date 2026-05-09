import { createThemePart } from '@ngneers/controls-themes/api';
import { scrollShadowDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

export const scrollShadowStyles = createThemePart({
  controlTemplate: scrollShadowDirectiveTemplate,
  dependencies: [],
  root: {
    css: () => '',
  },
});
