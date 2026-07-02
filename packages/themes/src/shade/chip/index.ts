import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  slotColors,
} from '@ngneers/controls-themes/shade/base';
import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';

export const chipStyles = createThemePart({
  controlTemplate: chipControlTemplate,
  base: baseStyles.chip,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // Secondary-toned pill by default; a color-* class recolors it via the slot vars.
    css: ({ v, c }) => css`
      ${slotColors(c, v)}

      ${c('root')} {
        --chip-bg: var(--theme-bg, ${v('color.secondary.base')});
        background: var(--chip-bg);
        border-radius: ${v('size.rounded.md')};
      }

      ${c('content')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        font-size: ${v('font.size.sm')};
        line-height: 1.25rem;
        background: none;
        color: var(--theme-fg, ${v('color.secondary.foreground')});
        border: none;
      }

      ${c('close-button')} {
        cursor: pointer;
        padding: 0 ${v('size.padding.md')} 0 calc(${v('size.padding.sm')} / 2);
        background: none;
        color: var(--theme-fg, ${v('color.secondary.foreground')});
        border: none;
        border-top-right-radius: ${v('size.rounded.md')};
        border-bottom-right-radius: ${v('size.rounded.md')};
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
          border-radius: ${v('size.rounded.md')};
        }
        &:has(${c('content')}:hover) {
          background: color-mix(in srgb, var(--chip-bg) 80%, transparent);
        }
        &:has(${c('content')}:active) {
          background: color-mix(in srgb, var(--chip-bg) 70%, transparent);
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
