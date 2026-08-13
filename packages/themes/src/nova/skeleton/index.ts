import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { skeletonControlTemplate } from '@awdlab/jig-themes/templates/skeleton';

export const skeletonStyles = createThemePart({
  controlTemplate: skeletonControlTemplate,
  base: baseStyles.skeleton,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    // Travelling gradient sweep, shared with the table's skeleton rows.
    css: ({ v, c }) => css`
      ${c('root')} {
        opacity: 1;
        border-radius: var(--radius, ${v('size.rounded.sm')});
        background: linear-gradient(
          90deg,
          ${v('color.surface.200')} 25%,
          ${v('color.surface.100')} 37%,
          ${v('color.surface.200')} 63%
        );
        background-size: 400% 100%;
        background-clip: content-box;
        animation: ${c('root', 'animation')} 1.4s ease infinite;
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
