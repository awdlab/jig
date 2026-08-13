import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { skeletonControlTemplate } from '@awdlab/jig-themes/templates/skeleton';

export const skeletonStyles = createThemePart({
  controlTemplate: skeletonControlTemplate,
  base: baseStyles.skeleton,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    // Flat surface with a slow opacity pulse — no gradient, matching shade's flatter look.
    css: ({ v, c }) => css`
      ${c('root')} {
        opacity: 1;
        border-radius: var(--jig-skeleton-radius, ${v('size.rounded.sm')});
        background: ${v('color.muted.base')};
        background-clip: content-box;
        animation: ${c('root', 'animation')} 1.8s ease-in-out infinite;
      }
      @keyframes ${c('root', 'animation')} {
        50% {
          opacity: 0.55;
        }
        0%,
        100% {
          opacity: 1;
        }
      }
    `,
  },
});
