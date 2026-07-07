import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { hintControlTemplate } from '@ngneers/controls-themes/templates/hint';

export const hintStyles = createThemePart({
  controlTemplate: hintControlTemplate,
  base: baseStyles.hint,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // Shade's palette is intentionally monochrome, so it has no info/success/warning
    // color tokens. Hints need semantic signalling, so those three kinds introduce
    // fixed accessible hues here; `error` reuses the destructive token for cohesion
    // and `default` is muted body text.
    css: ({ v, c }) => css`
      ${c('root')} {
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.xs')};
        line-height: ${v('font.size.xs')};
      }

      ${c('icon')} {
        color: inherit;
        font-size: 0.85rem;
      }

      ${c('kind-info')} {
        color: #2563eb;
      }

      ${c('kind-success')} {
        color: #16a34a;
      }

      ${c('kind-warning')} {
        color: #d97706;
      }

      ${c('kind-error')} {
        color: ${v('color.destructive.base')};
      }
    `,
  },
});
