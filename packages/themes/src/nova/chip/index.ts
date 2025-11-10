import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { chipControlTemplate } from '@ngneers/controls-themes/templates/chip';

export const chipStyles = createThemePart({
  controlTemplate: chipControlTemplate,
  base: baseStyles.chip,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.surface.200')};
        --chip-foreground-focus: var(--chip-foreground);
        --chip-background-focus: ${v('color.surface.300')};
        --chip-foreground-hover: var(--chip-foreground);
        --chip-background-hover: ${v('color.surface.300')};
        --chip-foreground-active: var(--chip-foreground);
        --chip-background-active: ${v('color.surface.400')};

        background: var(--chip-background);
        border-radius: 999rem; /* Creates a pill shape */
      }

      ${c('content')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.lg')};
        font-size: ${v('font.size.sm')};
        line-height: 1.25rem;
        background: none;
        color: var(--chip-foreground);
        border: none;
      }

      ${c('close-button')} {
        cursor: pointer;
        padding: 0 ${v('size.padding.md')} 0 calc(${v('size.padding.sm')} / 2);
        background: none;
        color: var(--chip-foreground);
        border: none;
        border-top-right-radius: 999rem; /* Creates a pill shape */
        border-bottom-right-radius: 999rem; /* Creates a pill shape */
        font-size: 12px;

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
          background: var(--chip-background-focus);

          ${c('content')}, ${c('close-button')} {
            color: var(--chip-foreground-focus);
          }
        }

        &:has(${c('content')}:hover) {
          background: var(--chip-background-hover);

          ${c('content')}, ${c('close-button')} {
            color: var(--chip-foreground-hover);
          }
        }

        &:has(${c('content')}:active) {
          background: var(--chip-background-active);

          ${c('content')}, ${c('close-button')} {
            color: var(--chip-foreground-active);
          }
        }
      }

      ${c('closable')} {
        ${c('content')} {
          padding-right: calc(${v('size.padding.sm')} / 2);
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }

      ${c('color-primary')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.primary.default')};
        --chip-background-focus: ${v('color.primary.200')};
        --chip-background-hover: ${v('color.primary.300')};
        --chip-background-active: ${v('color.primary.100')};
      }

      ${c('color-secondary')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.secondary.default')};
        --chip-background-focus: ${v('color.secondary.200')};
        --chip-background-hover: ${v('color.secondary.300')};
        --chip-background-active: ${v('color.secondary.100')};
      }

      ${c('color-accent')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.accent.default')};
        --chip-background-focus: ${v('color.accent.200')};
        --chip-background-hover: ${v('color.accent.300')};
        --chip-background-active: ${v('color.accent.100')};
      }

      ${c('color-info')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.info.default')};
        --chip-background-focus: ${v('color.info.200')};
        --chip-background-hover: ${v('color.info.300')};
        --chip-background-active: ${v('color.info.100')};
      }

      ${c('color-success')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.success.default')};
        --chip-background-focus: ${v('color.success.200')};
        --chip-background-hover: ${v('color.success.300')};
        --chip-background-active: ${v('color.success.100')};
      }

      ${c('color-warning')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.warning.default')};
        --chip-background-focus: ${v('color.warning.200')};
        --chip-background-hover: ${v('color.warning.300')};
        --chip-background-active: ${v('color.warning.100')};
      }

      ${c('color-error')} {
        --chip-foreground: ${v('color.text')};
        --chip-background: ${v('color.error.default')};
        --chip-background-focus: ${v('color.error.200')};
        --chip-background-hover: ${v('color.error.300')};
        --chip-background-active: ${v('color.error.100')};
      }
    `,
  },
});
