import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { badgeControlTemplate } from '@awdlab/jig-themes/templates/badge';

export const badgeStyles = createThemePart({
  controlTemplate: badgeControlTemplate,
  base: baseStyles.badge,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // --awd-badge-color is set by the directive; falls back to the primary color.
    css: ({ v, c }) => css`
      ${c('root')} {
        min-width: 1.25rem;
        height: 1.25rem;
        padding: 0 0.375rem;
        border-radius: ${v('size.rounded.full')};
        /* Background-colored ring so the badge reads on any anchor (icon, button, avatar). */
        box-shadow: 0 0 0 2px ${v('color.background')};
        background: var(--awd-badge-color, ${v('color.primary.base')});
        color: ${v('color.primary.foreground')};
        font-size: ${v('font.size.sm')};
        font-weight: ${v('font.weight.semibold')};
        line-height: 1;
      }
      ${c('dot')} {
        min-width: 0.625rem;
        width: 0.625rem;
        height: 0.625rem;
        padding: 0;
      }
    `,
  },
});
