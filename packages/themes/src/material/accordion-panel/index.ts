import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { accordionPanelControlTemplate } from '@awdlab/jig-themes/templates/accordion-panel';

export const accordionPanelStyles = createThemePart({
  controlTemplate: accordionPanelControlTemplate,
  base: baseStyles.accordionPanel,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 14px;
        &:not(:last-child) {
          border-bottom: 1px solid ${v('color.border')};
        }
      }
      ${c('content-expander')} {
        color: ${v('color.text')};
        transition: grid-template-rows 0.2s ease-in-out;
      }
      ${c('content')} {
        awd-defer {
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
        transition: background 0.2s ease-in-out;
        awd-icon {
          color: ${v('color.surface.500')};
          margin: 0 ${v('size.padding.md')};
          transition: color 0.2s ease-in-out;
        }
        &:hover {
          background: color-mix(in srgb, ${v('color.text')} 8%, transparent);
          ${c('header-text')} {
            color: ${v('color.text')};
          }
          awd-icon {
            color: ${v('color.surface.600')};
          }
        }
        &:focus-visible {
          outline: none;
          background: color-mix(in srgb, ${v('color.text')} 12%, transparent);
          ${c('header-text')} {
            color: ${v('color.text')};
          }
          awd-icon {
            color: ${v('color.text')};
          }
        }
      }
      ${c('header-disabled')}, ${c('header-disabled')}:hover {
        cursor: default;
        ${c('header-text')} {
          color: ${v('color.surface.300')};
        }
        awd-icon {
          color: ${v('color.surface.300')};
        }
      }
      ${c('header-text')} {
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        font-weight: ${v('font.weight.medium')};
        /* MD expansion-panel title is on-surface (near-black), not grey */
        color: ${v('color.text')};
        transition: color 0.2s ease-in-out;
      }
    `,
  },
});
