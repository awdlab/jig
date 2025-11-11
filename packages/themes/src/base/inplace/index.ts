import { createThemePart } from '@ngneers/controls-themes/api';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

export const inplaceStyles = createThemePart({
  controlTemplate: inplaceControlTemplate,
  dependencies: [],
  root: {},
});
