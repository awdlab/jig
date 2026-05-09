import { createThemePart } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { scrollShadowDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

export const scrollShadowStyles = createThemePart({
  controlTemplate: scrollShadowDirectiveTemplate,
  base: baseStyles.scrollShadow,
  dependencies: [],
  root: {
    css: () => '',
  },
});
