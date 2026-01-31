import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@ngneers/controls-themes/nova/base';
import { messageControlTemplate } from '@ngneers/controls-themes/templates/message';

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
        color: var(--theme-color-700);
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        font-size: ${v('font.size.sm')};
        border: 1px solid var(--theme-color-300);
      }

      ${c('icon')} {
        color: var(--theme-color-700);
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
    `,
  },
});
