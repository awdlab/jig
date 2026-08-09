import { createThemePart } from '@awdlab/jig-themes/api';
import { inplaceControlTemplate } from '@awdlab/jig-themes/templates/inplace';

export const inplaceStyles = createThemePart({
  controlTemplate: inplaceControlTemplate,
  dependencies: [],
  root: {},
});
