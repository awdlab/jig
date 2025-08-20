import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { accordionControlTemplate } from '@ngneers/controls-themes/templates/accordion';

export const accordionStyles = createThemePart({
  controlTemplate: accordionControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        flex-direction: column;
      }
      ${c('panel')} {
        border-bottom: 1px solid ${v('color.surface.200')};
      }
      ${c('panel-content')} {
        display: block;
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        color: ${v('color.text')};
      }
      ${c('panel-header')} {
        display: flex;
        cursor: pointer;
        &:hover {
          ${c('panel-header-text')} {
            color: ${v('color.surface.600')};
          }
        }
        &:focus-visible {
          outline: none;
          ${c('panel-header-text')} {
            color: ${v('color.text')};
          }
        }
      }
      ${c('panel-header-text')} {
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        font-weight: ${v('font.weight.semibold')};
        color: ${v('color.surface.500')};
        transition: color 0.2s ease-in-out;
      }
    `,
  },
});
