import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { spinnerControlTemplate } from '@awdlab/jig-themes/templates/spinner';

export const stateControlTemplate = createControlTemplate({
  scope: 'state',
  classNames: ['root', 'visible', 'replace-content', 'indicator', 'sr-only', 'kind-*'],
  dependencies: [
    { class: 'icon', template: iconControlTemplate },
    { class: 'spinner', template: spinnerControlTemplate },
    // Projected slots so `d()` yields the ancestor's raw class, since the consumer places state inside a button or input-field.
    { class: 'button', template: buttonControlTemplate, projected: true },
    { class: 'input-field', template: inputFieldControlTemplate, projected: true },
  ],
});
