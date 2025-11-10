import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';

export const messageStyles = createThemePart({
  controlTemplate: messageControlTemplate,
  base: baseStyles.message,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('')} {
        --message-foreground: ${v('color.text')};
        --message-background: ${v('color.surface.200')};
        --message-border: ${v('color.surface.400')};

        gap: ${v('size.padding.md')};
        background: var(--message-background);
        color: var(--message-foreground);
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        font-size: ${v('font.size.sm')};
        border: 1px solid var(--message-border);
      }

      ${c('icon')} {
        color: var(--message-foreground);
        font-size: 1.25rem;
        line-height: 1;
        margin-top: 0.125rem;
      }

      ${c('content')} {
        line-height: 1.5;
      }

      ${c('kind-outlined')} {
        background: transparent;
        border-width: 2px;
      }

      ${c('kind-simple')} {
        background: transparent;
        border: none;
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
      }

      ${c('color-primary')} {
        --message-foreground: ${v('color.primary.700')};
        --message-background: ${v('color.primary.50')};
        --message-border: ${v('color.primary.300')};
      }

      ${c('color-secondary')} {
        --message-foreground: ${v('color.secondary.700')};
        --message-background: ${v('color.secondary.50')};
        --message-border: ${v('color.secondary.300')};
      }

      ${c('color-accent')} {
        --message-foreground: ${v('color.accent.700')};
        --message-background: ${v('color.accent.50')};
        --message-border: ${v('color.accent.300')};
      }

      ${c('color-info')} {
        --message-foreground: ${v('color.info.700')};
        --message-background: ${v('color.info.50')};
        --message-border: ${v('color.info.300')};
      }

      ${c('color-success')} {
        --message-foreground: ${v('color.success.700')};
        --message-background: ${v('color.success.50')};
        --message-border: ${v('color.success.300')};
      }

      ${c('color-warning')} {
        --message-foreground: ${v('color.warning.700')};
        --message-background: ${v('color.warning.50')};
        --message-border: ${v('color.warning.300')};
      }

      ${c('color-error')} {
        --message-foreground: ${v('color.error.700')};
        --message-background: ${v('color.error.50')};
        --message-border: ${v('color.error.300')};
      }
    `,
  },
});
