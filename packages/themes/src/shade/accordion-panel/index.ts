import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  focusRingStyles,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { accordionPanelControlTemplate } from '@awdlab/jig-themes/templates/accordion-panel';

export const accordionPanelStyles = createThemePart({
  controlTemplate: accordionPanelControlTemplate,
  base: baseStyles.accordionPanel,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        --icon-size: 14px;
        font-size: ${v('font.size.sm')};
        border-bottom: 1px solid ${v('color.border')};
      }
      ${c('content-expander')} {
        color: ${v('color.foreground')};
        transition: grid-template-rows ${v('anim.time.fade')} ease-in-out;
      }
      ${c('content')} {
        jig-defer {
          padding-top: 0;
          padding-bottom: ${v('size.padding.md')};
          padding-inline-start: ${v('size.padding.xl')};
          padding-inline-end: ${v('size.padding.xl')};
          color: ${v('color.muted.foreground')};
        }
      }
      ${c('header')} {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        user-select: none;
        jig-icon {
          color: ${v('color.muted.foreground')};
          margin: 0 ${v('size.padding.md')};
          transition: color ${v('anim.time.fade')} ease-in-out;
        }
        &:hover {
          ${c('header-text')} {
            text-decoration: underline;
          }
        }
        &:focus-visible {
          ${focusRingStyles(v)}
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
        transition: color ${v('anim.time.fade')} ease-in-out;
      }
    `,
  },
});
