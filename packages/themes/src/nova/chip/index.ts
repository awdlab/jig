import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@ngneers/controls-themes/nova/base';
import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';

export const chipStyles = createThemePart({
  controlTemplate: chipControlTemplate,
  base: baseStyles.chip,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        background: var(--theme-color-400);
        border-radius: 999rem; /* Creates a pill shape */
      }

      ${c('content')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        font-size: ${v('font.size.sm')};
        line-height: 1.25rem;
        background: none;
        color: ${v('color.text')};
        border: none;
      }

      ${c('close-button')} {
        cursor: pointer;
        padding: 0 ${v('size.padding.md')} 0 calc(${v('size.padding.sm')} / 2);
        background: none;
        color: ${v('color.text')};
        border: none;
        border-top-right-radius: 999rem; /* Creates a pill shape */
        border-bottom-right-radius: 999rem; /* Creates a pill shape */
        font-size: 0.75rem;

        &:focus {
          opacity: 0.8;
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
          border-radius: 999rem; /* Creates a pill shape */
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
          padding-right: calc(${v('size.padding.sm')} / 2);
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    `,
  },
});
