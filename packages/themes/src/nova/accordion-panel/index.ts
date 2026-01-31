import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { accordionPanelControlTemplate } from '@ngneers/controls-themes/templates/accordion-panel';

export const accordionPanelStyles = createThemePart({
  controlTemplate: accordionPanelControlTemplate,
  base: baseStyles.accordionPanel,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 14px;
        &:not(:last-child) {
          border-bottom: 1px solid ${v('color.surface.200')};
        }
      }
      ${c('content-expander')} {
        color: ${v('color.text')};
        transition: grid-template-rows 0.2s ease-in-out;
      }
      ${c('content')} {
        ngn-defer {
          padding-top: 0;
          padding-bottom: ${v('size.padding.md')};
          padding-left: ${v('size.padding.xl')};
          padding-right: ${v('size.padding.xl')};
        }
      }
      ${c('header')} {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        user-select: none;
        ngn-icon {
          color: ${v('color.surface.500')};
          margin: 0 ${v('size.padding.md')};
          transition: color 0.2s ease-in-out;
        }
        &:hover {
          ${c('header-text')} {
            color: ${v('color.surface.600')};
          }
          ngn-icon {
            color: ${v('color.surface.600')};
          }
        }
        &:focus-visible {
          ${c('header-text')} {
            color: ${v('color.text')};
          }
          ngn-icon {
            color: ${v('color.text')};
          }
        }
      }
      ${c('header-disabled')}, ${c('header-disabled')}:hover {
        cursor: default;
        ${c('header-text')} {
          color: ${v('color.surface.300')};
        }
        ngn-icon {
          color: ${v('color.surface.300')};
        }
      }
      ${c('header-text')} {
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        font-weight: ${v('font.weight.semibold')};
        color: ${v('color.surface.500')};
        transition: color 0.2s ease-in-out;
      }
    `,
  },
});
