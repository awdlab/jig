import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { hintControlTemplate } from '@awdlab/jig-themes/templates/hint';

export const hintStyles = createThemePart({
  controlTemplate: hintControlTemplate,
  base: baseStyles.hint,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // The neutral `default` kind is muted body text; the semantic kinds pull the
    // matching MD3 role color at its base (500) tone — the scheme-stable shade
    // that reads correctly whether nova-style palette reversal is in play or not.
    css: ({ v, c }) => css`
      ${c('root')} {
        color: color-mix(in srgb, ${v('color.text')} 60%, transparent);
        font-size: ${v('font.size.xs')};
        line-height: ${v('font.size.xs')};
        transition:
          grid-template-rows 0.2s ease-in-out,
          margin 0.2s ease-in-out;
      }

      ${c('icon')} {
        color: inherit;
        font-size: 0.85rem;
      }

      ${c('kind-info')} {
        color: ${v('color.info.500')};
      }

      ${c('kind-success')} {
        color: ${v('color.success.500')};
      }

      ${c('kind-warning')} {
        color: ${v('color.warning.500')};
      }

      ${c('kind-error')} {
        color: ${v('color.error.500')};
      }
    `,
  },
});
