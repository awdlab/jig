import { createThemePart, createVariableTemplate, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const popoverVariables = createVariableTemplate({
  scope: 'popover',
  variables: {
    content: {
      borderColor: null,
      borderRadius: null,
      borderWidth: null,
      padding: null,
      background: null,
      color: null,
      boxShadow: null,
    },
  },
});

export const popoverStyles = createThemePart({
  controlTemplate: popoverControlTemplate,
  variables: [popoverVariables],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    values: {
      content: {
        borderColor: '{color.surface.300}',
        borderRadius: '{size.rounded.md}',
        borderWidth: '1px',
        padding: '{size.rounded.md}',
        background: '{color.background}',
        color: '{color.text}',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    },
    css: ({ v, c }) => css`
      ${c()} {
        background: transparent;
        pointer-events: none;
      }
      ${c('content')} {
        pointer-events: auto;
        border-style: solid;
        background: ${v('popover.content.background')};
        color: ${v('popover.content.color')};
        border-color: ${v('popover.content.borderColor')};
        border-radius: ${v('popover.content.borderRadius')};
        border-width: ${v('popover.content.borderWidth')};
        padding: ${v('popover.content.padding')};
        box-shadow: ${v('popover.content.boxShadow')};
      }
    `,
  },
});
