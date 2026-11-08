import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  slotColors,
} from '@awdlab/jig-themes/shade/base';
import { messageControlTemplate } from '@awdlab/jig-themes/templates/message';

export const messageStyles = createThemePart({
  controlTemplate: messageControlTemplate,
  base: baseStyles.message,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // shadcn Alert: a bordered card whose text and border take the color slot's base.
    css: ({ v, c }) => css`
      ${slotColors(c, v)}

      ${c('root')} {
        --message-ink: var(--theme-bg, ${v('color.foreground')});
        gap: ${v('size.padding.md')};
        background: ${v('color.background')};
        color: var(--message-ink);
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.lg')};
        font-size: ${v('font.size.sm')};
        border: 1px solid color-mix(in srgb, var(--message-ink) 50%, transparent);
      }

      /* The surface slot's base is the page background, so it keeps the neutral card. */
      ${c('color-surface')} {
        --message-ink: ${v('color.foreground')};
        border-color: ${v('color.border')};
      }

      ${c('icon')} {
        color: inherit;
        font-size: 1.15rem;
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
    `,
  },
});
