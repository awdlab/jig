import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { messageControlTemplate } from '@awdlab/jig-themes/templates/message';

export const messageStyles = createThemePart({
  controlTemplate: messageControlTemplate,
  base: baseStyles.message,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // shadcn Alert: two kinds. default is a neutral bordered card; destructive is text-styled.
    css: ({ v, c }) => css`
      ${c('root')} {
        gap: ${v('size.padding.md')};
        background: ${v('color.background')};
        color: ${v('color.foreground')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.lg')};
        font-size: ${v('font.size.sm')};
        border: 1px solid ${v('color.border')};
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

      ${c('kind-destructive')} {
        color: ${v('color.destructive.base')};
        border-color: color-mix(in srgb, ${v('color.destructive.base')} 50%, transparent);
      }
    `,
  },
});
