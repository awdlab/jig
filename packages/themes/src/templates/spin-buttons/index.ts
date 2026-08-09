import { createControlTemplate } from '@awdlab/jig-themes/api';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';

export const spinButtonsControlTemplate = createControlTemplate({
  scope: 'spinButtons',
  classNames: [
    'root',
    // Edge the buttons bleed toward (leading = before the input, trailing = after).
    'leading',
    'trailing',
    // Both buttons present — the stacked/inline pair (vs a lone flanking button).
    'pair',
    'kind-*',
  ],
  dependencies: [
    { class: 'decrement', template: buttonControlTemplate },
    { class: 'increment', template: buttonControlTemplate },
  ],
});
