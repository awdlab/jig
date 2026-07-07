import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { spinnerControlTemplate } from '@ngneers/controls-themes/templates/spinner';

export const stateControlTemplate = createControlTemplate({
  scope: 'state',
  classNames: ['root', 'visible', 'replace-content', 'indicator', 'kind-*'],
  dependencies: [
    inputFieldControlTemplate,
    buttonControlTemplate,
    iconControlTemplate,
    spinnerControlTemplate,
  ],
});
