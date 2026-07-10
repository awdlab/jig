import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { spinnerControlTemplate } from '@ngneers/controls-themes/templates/spinner';

export const stateControlTemplate = createControlTemplate({
  scope: 'state',
  classNames: ['root', 'visible', 'replace-content', 'indicator', 'kind-*'],
  dependencies: [
    { class: 'icon', template: iconControlTemplate },
    { class: 'spinner', template: spinnerControlTemplate },
    // state never renders a button/input-field — it is placed INSIDE one by the
    // consumer (e.g. `<button ngnButton><ngn-state/></button>`), so there is no
    // host element here to mark with [ptDep]. These slots exist purely so `d()`
    // can produce the ancestor's raw class for `:has()`/child-combinator
    // selectors below; `projected: true` gives raw (unmarked) classes, matching
    // the direction of this relationship.
    { class: 'button', template: buttonControlTemplate, projected: true },
    { class: 'input-field', template: inputFieldControlTemplate, projected: true },
  ],
});
