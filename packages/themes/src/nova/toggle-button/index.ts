import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { toggleButtonControlTemplate } from '@ngneers/controls-themes/templates/toggle-button';

export const toggleButtonStyles = createThemePart({
  controlTemplate: toggleButtonControlTemplate,
  base: baseStyles.toggleButton,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} ${c('button')} {
        display: inline-grid;
        border-radius: ${v('size.rounded.md')};
        background-color: ${v('color.surface.100')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border: 1px solid ${v('color.surface.400')};
        position: relative;
        font-weight: ${v('font.weight.normal')};
        cursor: pointer;
        transition: background-color ${v('anim.ease.snappyFade')} ${v('anim.time.snappyFade')};
        &:disabled {
          cursor: default;
          color: ${v('color.disabled.text')};
          background-color: ${v('color.disabled.background')};
        }
        &[aria-readonly='true'] {
          cursor: default;
        }
        &:focus-visible {
          outline: 2px solid ${v('color.text')};
        }
      }
      ${c('root')} ${c('button')}:hover:not(:disabled):not([aria-readonly='true']) {
        background-color: ${v('color.surface.200')};
      }
      ${c('label')}, ${c('placeholder')}, ${c('placeholder-active')} {
        align-items: center;
        justify-content: center;
        gap: ${v('size.padding.md')};
      }
      ${c('placeholder-active')} {
        font-weight: ${v('font.weight.semibold')};
      }
      ${c('active')} ${c('button')} {
        ${c('label')} {
          font-weight: ${v('font.weight.semibold')};
        }
        &::before {
          content: '';
          position: absolute;
          inset: ${v('size.padding.sm')};
          background: ${v('color.background')};
          border-radius: ${v('size.rounded.lg')};
          transition: box-shadow ${v('anim.ease.snappyFade')} ${v('anim.time.snappyFade')};
        }
        &:disabled:before {
          background: ${v('color.surface.100')};
        }
      }
      ${c('invalid')} ${c('button')} {
        border-color: ${v('color.invalid.border')};
      }
    `,
  },
});
