import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  sizesTemplate,
  themedColors,
} from '@awdlab/jig-themes/nova/base';
import { chipControlTemplate } from '@awdlab/jig-themes/templates/chip';

export const chipStyles = createThemePart({
  controlTemplate: chipControlTemplate,
  base: baseStyles.chip,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        background: var(--theme-color-100);
        border-radius: ${v('size.rounded.full')};
      }

      ${c('content')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        font-size: ${v('font.size.sm')};
        line-height: 1.25rem;
        background: none;
        color: var(--theme-color-600-on-100);
        border: none;
      }

      ${c('close-button')} {
        cursor: pointer;
        padding: 0 ${v('size.padding.md')} 0 calc(${v('size.padding.sm')} / 2);
        background: none;
        color: var(--theme-color-600-on-100);
        border: none;
        border-start-end-radius: ${v('size.rounded.full')};
        border-end-end-radius: ${v('size.rounded.full')};
        font-size: 0.75rem;

        /* Inset: the button is flush with the chip's edge, so an offset ring would sit
           outside the pill instead of marking the button. */
        &:focus-visible {
          outline: 3px solid ${controlRing(v)};
          outline-offset: -3px;
        }

        &:hover {
          opacity: 0.7;
        }

        &:active {
          opacity: 0.5;
        }
      }

      ${c('actionable')} {
        ${c('content')} {
          cursor: pointer;
          border-radius: ${v('size.rounded.full')};
          &:focus-visible {
            outline: 3px solid ${controlRing(v)};
            outline-offset: -3px;
          }
        }

        &:has(${c('content')}:focus) {
          background: var(--theme-color-200);
        }

        &:has(${c('content')}:hover) {
          background: var(--theme-color-300);
        }

        &:has(${c('content')}:active) {
          background: var(--theme-color-100);
        }
      }

      ${c('closable')} {
        ${c('content')} {
          padding-inline-end: calc(${v('size.padding.sm')} / 2);
          border-start-end-radius: 0;
          border-end-end-radius: 0;
        }
      }
    `,
  },
});
