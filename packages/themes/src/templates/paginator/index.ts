import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const paginatorControlTemplate = createControlTemplate({
  scope: 'paginator',
  classNames: [''],
  dependencies: [buttonControlTemplate],
});
