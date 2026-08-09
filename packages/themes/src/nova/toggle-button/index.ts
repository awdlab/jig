import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { toggleButtonControlTemplate } from '@awdlab/jig-themes/templates/toggle-button';

export const toggleButtonStyles = createThemePart({
  controlTemplate: toggleButtonControlTemplate,
  base: baseStyles.toggleButton,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('root')} ${c('button')} {
        display: inline-grid;
        border-radius: ${v('size.rounded.md')};
        background-color: ${v('color.surface.50')};
        color: ${v('color.surface.700')};
        height: ${v('size.height.control')};
        align-content: center;
        padding: 0 ${v('size.padding.lg')};
        border: none;
        position: relative;
        font-weight: ${v('font.weight.normal')};
        cursor: pointer;
        /* Background only — see the button theme: transitioning colour with it looks muddy. */
        transition: background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
        &:disabled {
          cursor: default;
          background-color: ${v('color.disabled.background')};
          color: ${v('color.disabled.text')};
        }
        &[aria-readonly='true'] {
          cursor: default;
        }
        &:focus-visible {
          outline: 3px solid ${controlRing(v)};
          outline-offset: 2px;
        }
      }
      ${c('root')}:not(${c('active')}) ${c(
        'button'
      )}:hover:not(:disabled):not([aria-readonly='true']) {
        color: ${v('color.surface.700')};
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
        color: ${v('color.primary.500-contrast')};
        ${c('label')} {
          font-weight: ${v('font.weight.semibold')};
        }
        &::before {
          content: '';
          position: absolute;
          inset: ${v('size.padding.sm')};
          background: ${v('color.primary.500')};
          border-radius: calc(${v('size.rounded.md')} - 3px);
        }
        &:disabled {
          color: ${v('color.disabled.text')};
        }
        &:disabled::before {
          background: ${v('color.surface.200')};
        }
      }
      ${c('invalid')} ${c('button')} {
        outline: 1px solid ${v('color.invalid.border')};
      }
    `,
  },
});
