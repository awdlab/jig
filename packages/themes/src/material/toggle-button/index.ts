import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
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
        /* Tonal surface fill so an unselected toggle reads as a button, not bare text */
        background-color: ${v('color.surface.100')};
        color: ${v('color.surface.600')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border: none;
        position: relative;
        font-family: ${v('font.family')};
        font-weight: ${v('font.weight.normal')};
        cursor: pointer;
        transition:
          color ${v('anim.ease.snappyFade')} ${v('anim.time.snappyFade')},
          background-color ${v('anim.ease.snappyFade')} ${v('anim.time.snappyFade')};
        &:disabled {
          cursor: default;
          color: ${v('color.disabled.text')};
        }
        &[aria-readonly='true'] {
          cursor: default;
        }
        &:focus-visible {
          outline: 2px solid color-mix(in srgb, ${v('color.primary.500')} 50%, transparent);
          outline-offset: 2px;
        }
      }
      ${c('root')}:not(${c('active')}) ${c(
        'button'
      )}:hover:not(:disabled):not([aria-readonly='true']) {
        background-color: ${v('color.surface.200')};
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
        color: ${v('color.primary.foreground')};
        background-color: color-mix(
          in srgb,
          ${v('color.primary.500')} 16%,
          ${v('color.background')}
        );
        ${c('label')} {
          font-weight: ${v('font.weight.medium')};
        }
        &:disabled {
          color: ${v('color.disabled.text')};
          background-color: ${v('color.disabled.background')};
        }
      }
      ${c('invalid')} ${c('button')} {
        outline: 1px solid ${v('color.invalid.border')};
      }
    `,
  },
});
