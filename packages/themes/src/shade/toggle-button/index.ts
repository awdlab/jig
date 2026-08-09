import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';

export const toggleButtonStyles = createThemePart({
  controlTemplate: toggleButtonControlTemplate,
  base: baseStyles.toggleButton,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} ${c('button')} {
        display: inline-grid;
        border-radius: ${v('size.rounded.md')};
        background-color: ${v('color.muted.base')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border: 1px solid ${v('color.border')};
        position: relative;
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.sm')};
        font-weight: ${v('font.weight.normal')};
        cursor: pointer;
        transition: background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
        &:disabled {
          cursor: default;
          opacity: 0.5;
        }
        &[aria-readonly='true'] {
          cursor: default;
        }
        &:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
        }
      }
      ${c('root')} ${c('button')}:hover:not(:disabled):not([aria-readonly='true']) {
        background-color: ${v('color.accent.base')};
        color: ${v('color.accent.foreground')};
      }
      ${c('label')}, ${c('placeholder')}, ${c('placeholder-active')} {
        align-items: center;
        justify-content: center;
        gap: ${v('size.padding.md')};
      }
      ${c('placeholder-active')} {
        font-weight: ${v('font.weight.medium')};
      }
      ${c('active')} ${c('button')} {
        color: ${v('color.foreground')};
        ${c('label')} {
          font-weight: ${v('font.weight.medium')};
        }
        &::before {
          content: '';
          position: absolute;
          inset: ${v('size.padding.sm')};
          background: ${v('color.background')};
          border-radius: ${v('size.rounded.sm')};
          box-shadow: ${v('shadow.sm')};
          transition: box-shadow ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
        }
        &:disabled:before {
          background: ${v('color.muted.base')};
        }
      }
      ${c('invalid')} ${c('button')} {
        border-color: ${v('color.destructive.base')};
      }
    `,
  },
});
