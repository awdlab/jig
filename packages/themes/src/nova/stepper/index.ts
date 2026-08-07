import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';

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
        --box-size: 1.5rem;
        width: var(--box-size);
        height: var(--box-size);
        border-radius: ${v('size.rounded.full')};
        /* Upcoming step: an outlined marker so it reads as a reachable to-do, not a
           disabled (opacity-dimmed) step. Active/completed override background+border below. */
        background: ${v('color.background')};
        color: ${v('color.surface.700')};
        border: 1px solid ${v('color.border')};
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.sm')};
      }
      ${c('label')} {
        font-weight: ${v('font.weight.medium')};
        color: ${v('color.surface.700')};
      }
      ${c('optional')} {
        font-size: ${v('font.size.sm')};
        color: ${v('color.surface.500')};
      }
      ${c('connector')} {
        background: ${v('color.border')};
      }
      ${c('content')} {
        padding: ${v('size.padding.lg')} 0;
      }
      ${c('completed')} {
        ${c('marker')} {
          background: ${v('color.primary.500')};
          border-color: ${v('color.primary.500')};
          color: ${v('color.primary.500-contrast')};
        }
      }
      /* Declared after 'completed' so a revisited step that is both active and completed
         reads as the current step (ring), not as done (fill) — matches the template, which
         shows the step number rather than the check mark in that case. */
      ${c('active')} {
        ${c('marker')} {
          background: ${v('color.background')};
          border-color: ${v('color.primary.500')};
          border-width: 2px;
          color: ${v('color.primary.500')};
          box-shadow: 0 0 0 3px color-mix(in oklab, ${v('color.primary.500')} 18%, transparent);
        }
        ${c('label')} {
          color: ${v('color.surface.900')};
        }
      }
      ${c('error')} {
        ${c('marker')} {
          background: ${v('color.error.500')};
          border-color: ${v('color.error.500')};
          color: ${v('color.error.500-contrast')};
        }
        ${c('label')} {
          color: ${v('color.error.500')};
        }
      }
      ${c('disabled')} {
        opacity: 0.5;
      }
    `,
  },
});
