import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  base: baseStyles.button,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        --padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        border-style: none;
        font-weight: ${v('font.weight.semibold')};
        padding: var(--padding);
        cursor: pointer;
      }
      ${c('kind-primary')} {
        background: ${v('color.primary.500')};
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
        background: ${v('color.secondary.500')};
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
        --padding: ${v('size.padding.md')};

        width: calc(1em + 2 * var(--padding)); /** font size plus padding */
        height: calc(1em + 2 * var(--padding));
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background: ${v('color.surface.100')};
        }
        &:focus {
          background: ${v('color.surface.200')};
        }
        &:active {
          background: ${v('color.surface.300')};
        }

        &${c('inline')} {
          height: 1lh;
          width: 1lh;
        }
      }
      ${c('kind-link')} {
        text-decoration: underline;
        background: transparent;
        color: ${v('color.primary.500')};
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
