import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { skeletonControlTemplate } from '@awdlab/jig-themes/templates/skeleton';

export const skeletonStyles = createThemePart({
  controlTemplate: skeletonControlTemplate,
  base: baseStyles.skeleton,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    // Sweep on material's standard easing, with a wider highlight than nova's.
    css: ({ v, c }) => css`
      ${c('root')} {
        opacity: 1;
        border-radius: var(--radius, ${v('size.rounded.sm')});
        background: linear-gradient(
          90deg,
          ${v('color.surface.200')} 20%,
          ${v('color.surface.100')} 40%,
          ${v('color.surface.200')} 70%
        );
        background-size: 400% 100%;
        background-clip: content-box;
        animation: ${c('root', 'animation')} 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      @keyframes ${c('root', 'animation')} {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }
    `,
  },
});
