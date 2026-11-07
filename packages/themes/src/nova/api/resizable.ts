import { createThemePart } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { resizableDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

export const resizableStyles = createThemePart({
  controlTemplate: resizableDirectiveTemplate,
  base: baseStyles.resizable,
});
