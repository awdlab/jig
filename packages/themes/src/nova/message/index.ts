import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@awdlab/jig-themes/nova/base';
import { messageControlTemplate } from '@awdlab/jig-themes/templates/message';

export const messageStyles = createThemePart({
  controlTemplate: messageControlTemplate,
  base: baseStyles.message,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        gap: ${v('size.padding.md')};
        background: var(--theme-color-50);
        color: var(--theme-color-700-on-50);
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.lg')};
        font-size: ${v('font.size.sm')};
        border: 1px solid var(--theme-color-300);
      }

      ${c('icon')} {
        color: var(--theme-color-700-on-50);
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
