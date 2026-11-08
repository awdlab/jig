import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { hintControlTemplate } from '@awdlab/jig-themes/templates/hint';

export const hintStyles = createThemePart({
  controlTemplate: hintControlTemplate,
  base: baseStyles.hint,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.xs')};
        line-height: ${v('font.size.xs')};
        transition:
          grid-template-rows ${v('anim.time.fade')} ease-in-out,
          margin ${v('anim.time.fade')} ease-in-out;
      }

      ${c('icon')} {
        color: inherit;
        font-size: 0.85rem;
      }

      ${c('kind-info')} {
        color: ${v('color.info')};
      }

      ${c('kind-success')} {
        color: ${v('color.success')};
      }

      ${c('kind-warning')} {
        color: ${v('color.warning')};
      }

      ${c('kind-error')} {
        color: ${v('color.destructive.base')};
      }
    `,
  },
});
