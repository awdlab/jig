import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        border-radius: ${v('size.rounded.md')};
        border-style: none;
        font-weight: ${v('font.weight.semibold')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        cursor: pointer;
      }
      ${c('kind-primary')} {
        background: ${v('color.primary.default')};
        color: ${v('color.text')};
        &:hover {
          background: ${v('color.primary.300')};
        }
        &:focus {
          background: ${v('color.primary.200')};
        }
        &:active {
          background: ${v('color.primary.100')};
        }
      }
      ${c('kind-secondary')} {
        background: ${v('color.secondary.default')};
        color: ${v('color.text')};
        &:hover {
          background: ${v('color.secondary.400')};
        }
        &:focus {
          background: ${v('color.secondary.300')};
        }
        &:active {
          background: ${v('color.secondary.200')};
        }
      }
      ${c('kind-text')} {
        background: transparent;
        &:hover {
          background: ${v('color.primary.50')};
        }
        &:focus {
          background: ${v('color.primary.100')};
        }
        &:active {
          background: ${v('color.primary.200')};
        }
      }
      ${c('kind-icon')} {
        background: transparent;
        border-radius: ${v('size.rounded.full')};
        padding: ${v('size.padding.md')};
        &:hover {
          background: ${v('color.surface.100')};
        }
        &:focus {
          background: ${v('color.surface.200')};
        }
        &:active {
          background: ${v('color.surface.300')};
        }
      }
      ${c('kind-link')} {
        text-decoration: underline;
        background: transparent;
        color: ${v('color.primary.default')};
        &:hover {
          color: ${v('color.primary.500')};
        }
        &:focus {
          color: ${v('color.primary.600')};
        }
        &:active {
          color: ${v('color.primary.700')};
        }
      }
    `,
  },
});
