import { createThemePart } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { scrollShadowDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

export const scrollShadowStyles = createThemePart({
  controlTemplate: scrollShadowDirectiveTemplate,
  base: baseStyles.scrollShadow,
  dependencies: [],
  root: {
    // The scroll-shadow directive only exposes state classes (scrolled-start/end/top/bottom);
    // the visual shadows are rendered by the consuming parts (e.g. table sticky columns).
    css: () => '',
  },
});
