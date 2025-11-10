import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { tagControlTemplate } from '@ngneers/controls-themes/templates/tag';

export const tagStyles = createThemePart({
  controlTemplate: tagControlTemplate,
  base: baseStyles.tag,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('')} {
        --tag-foreground: ${v('color.text')};
        --tag-background: ${v('color.surface.200')};

        gap: ${v('size.padding.md')};
        background: var(--tag-background);
        color: var(--tag-foreground);
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        line-height: 1;
        border-radius: ${v('size.rounded.md')};
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.sm')};
      }

      ${c('icon')} {
        color: var(--tag-foreground);
        font-size: inherit;
      }

      ${c('kind-primary')} {
        --tag-foreground: ${v('color.primary.600')};
        --tag-background: ${v('color.primary.100')};
      }

      ${c('kind-secondary')} {
        --tag-foreground: ${v('color.secondary.600')};
        --tag-background: ${v('color.secondary.100')};
      }

      ${c('kind-accent')} {
        --tag-foreground: ${v('color.accent.600')};
        --tag-background: ${v('color.accent.100')};
      }

      ${c('kind-info')} {
        --tag-foreground: ${v('color.info.600')};
        --tag-background: ${v('color.info.100')};
      }

      ${c('kind-success')} {
        --tag-foreground: ${v('color.success.600')};
        --tag-background: ${v('color.success.100')};
      }

      ${c('kind-warning')} {
        --tag-foreground: ${v('color.warning.600')};
        --tag-background: ${v('color.warning.100')};
      }

      ${c('kind-error')} {
        --tag-foreground: ${v('color.error.600')};
        --tag-background: ${v('color.error.100')};
      }
    `,
  },
});
