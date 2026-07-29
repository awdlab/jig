import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { hintControlTemplate } from '@ngneers/controls-themes/templates/hint';

export const hintStyles = createThemePart({
  controlTemplate: hintControlTemplate,
  base: baseStyles.hint,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // The neutral `default` kind is muted body text; the semantic kinds pull the
    // matching palette. `700` self-adjusts across modes (nova reverses palettes in
    // dark mode, so `700` resolves to a light tone that reads on dark backgrounds).
    css: ({ v, c }) => css`
      ${c('root')} {
        color: color-mix(in srgb, ${v('color.text')} 60%, transparent);
        font-size: ${v('font.size.xs')};
        /* Hints sit under the control they describe: a small gap plus a normal line box keeps
           them from hugging the field (a line-height equal to the font size clamps to the glyphs). */
        line-height: 1.4;
        margin-top: ${v('size.padding.sm')};
      }

      ${c('icon')} {
        color: inherit;
        font-size: 0.85rem;
      }

      ${c('kind-info')} {
        color: ${v('color.info.700')};
      }

      ${c('kind-success')} {
        color: ${v('color.success.700')};
      }

      ${c('kind-warning')} {
        color: ${v('color.warning.700')};
      }

      ${c('kind-error')} {
        color: ${v('color.error.700')};
      }
    `,
  },
});
