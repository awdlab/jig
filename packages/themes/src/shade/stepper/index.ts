import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { stepperControlTemplate } from '@awdlab/jig-themes/templates/stepper';

export const stepperStyles = createThemePart({
  controlTemplate: stepperControlTemplate,
  base: baseStyles.stepper,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('header')} {
        gap: 0.5rem;
        padding: ${v('size.padding.md')} 0;
      }
      ${c('marker')} {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: ${v('size.rounded.full')};
        /* Upcoming step: an outlined marker so it reads as a reachable to-do, not a
           disabled (opacity-dimmed) step. Active/completed override background+border below. */
        background: ${v('color.background')};
        color: ${v('color.muted.foreground')};
        border: 2px solid ${v('color.border')};
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.sm')};
      }
      ${c('label')} {
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.muted.foreground')};
      }
      ${c('optional')} {
        font-size: ${v('font.size.sm')};
        color: ${v('color.muted.foreground')};
      }
      ${c('connector')} {
        background: ${v('color.border')};
      }
      ${c('content')} {
        padding: ${v('size.padding.lg')} 0;
      }
      ${c('completed')} {
        ${c('marker')} {
          background: ${v('color.primary.base')};
          border-color: ${v('color.primary.base')};
          color: ${v('color.primary.foreground')};
        }
      }
      /* Declared after 'completed' so a revisited step that is both active and completed
         reads as the current step (ring), not as done (fill) — matches the template, which
         shows the step number rather than the check mark in that case. */
      ${c('active')} {
        ${c('marker')} {
          background: ${v('color.background')};
          border-color: ${v('color.primary.base')};
          color: ${v('color.primary.base')};
        }
        ${c('label')} {
          color: ${v('color.foreground')};
        }
      }
      ${c('error')} {
        ${c('marker')} {
          background: ${v('color.destructive.base')};
          border-color: ${v('color.destructive.base')};
          color: ${v('color.destructive.foreground')};
        }
        ${c('label')} {
          color: ${v('color.destructive.base')};
        }
      }
      ${c('disabled')} {
        opacity: 0.5;
      }
    `,
  },
});
