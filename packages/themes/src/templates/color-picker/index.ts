import { createControlTemplate } from '@ngneers/controls-themes/api';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const colorPickerControlTemplate = createControlTemplate({
  scope: 'color-picker',
  classNames: [
    'root',
    'inline',
    'trigger',
    'preview',
    'panel',
    'sv-area',
    'sv-thumb',
    'hue-track',
    'hue-thumb',
    'alpha-track',
    'alpha-thumb',
    'swatches',
    'swatch',
    'fields',
    'channels',
    'channel',
    'channel-hex',
    'channel-label',
    'format-toggle',
    'invalid',
    'disabled',
  ],
  dependencies: [{ class: 'popover', template: popoverControlTemplate }],
});
