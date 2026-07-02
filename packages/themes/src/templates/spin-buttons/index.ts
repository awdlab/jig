import { createControlTemplate } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const spinButtonsControlTemplate = createControlTemplate({
  scope: 'spinButtons',
  classNames: [
    'root',
    'button',
    'increment',
    'decrement',
    // Edge the buttons bleed toward (leading = before the input, trailing = after).
    'leading',
    'trailing',
    // Both buttons present — the stacked/inline pair (vs a lone flanking button).
    'pair',
    'kind-*',
  ],
  dependencies: [buttonControlTemplate],
});
