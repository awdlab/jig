import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { accordionPanelControlTemplate } from '@awdlab/jig-themes/templates/accordion-panel';

export const accordionPanelStyles = createThemePart({
  controlTemplate: accordionPanelControlTemplate,
  base: baseStyles.accordionPanel,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 14px;
        font-size: ${v('font.size.sm')};
        border-bottom: 1px solid ${v('color.border')};
      }
      ${c('content-expander')} {
        color: ${v('color.foreground')};
        transition: grid-template-rows 0.2s ease-in-out;
      }
      ${c('content')} {
        awd-defer {
          padding-top: 0;
          padding-bottom: ${v('size.padding.md')};
          padding-left: ${v('size.padding.xl')};
          padding-right: ${v('size.padding.xl')};
          color: ${v('color.muted.foreground')};
        }
      }
      ${c('header')} {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        user-select: none;
        awd-icon {
          color: ${v('color.muted.foreground')};
          margin: 0 ${v('size.padding.md')};
          transition: color 0.2s ease-in-out;
        }
        &:hover {
          ${c('header-text')} {
            text-decoration: underline;
          }
        }
        &:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
          border-radius: ${v('size.rounded.sm')};
        }
      }
      ${c('header-disabled')},
      ${c('header-disabled')}:hover {
        cursor: default;
        opacity: 0.5;
        ${c('header-text')} {
          text-decoration: none;
        }
      }
      ${c('header-text')} {
        padding: ${v('size.padding.lg')} ${v('size.padding.xl')};
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.foreground')};
        transition: color 0.2s ease-in-out;
      }
    `,
  },
});
