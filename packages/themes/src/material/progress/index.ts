import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { animationTemplate, colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { progressControlTemplate } from '@awdlab/jig-themes/templates/progress';

export const progressStyles = createThemePart({
  controlTemplate: progressControlTemplate,
  base: baseStyles.progress,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => {
      void d;
      return css`
        ${c('track')} {
          background: ${v('color.surface.200')};
          border-radius: ${v('size.rounded.md')};
          height: 0.5rem;
        }
        ${c('fill')}, ${c('fill2')} {
          background: ${v('color.primary.500')};
          border-radius: ${v('size.rounded.md')};
          transition: width ${v('anim.time.fade')} ${v('anim.ease.fade')};
          height: 100%;
        }
        ${c('indeterminate')} {
          ${c('fill')} {
            animation: ${c('fill', 'animation')} 2s infinite;
          }
          ${c('fill2')} {
            animation: ${c('fill2', 'animation')} 2s 0.5s infinite;
          }
        }

        @keyframes ${c('fill', 'animation')} {
          from {
            left: -10%;
            width: 10%;
          }
          to {
            left: 130%;
            width: 100%;
          }
        }
        @keyframes ${c('fill2', 'animation')} {
          from {
            left: -80%;
            width: 80%;
          }
          to {
            left: 110%;
            width: 10%;
          }
        }

        /* Circular mode styles */

        ${c('circular')} ${c('track')} {
          stroke: ${v('color.surface.200')};
          background: none;
        }
        ${c('circular')} ${c('fill')} {
          stroke: ${v('color.primary.foreground')};
          background: none;
          transform-origin: center;
          transform: rotate(-90deg);
          transition: stroke-dashoffset ${v('anim.time.fade')} ${v('anim.ease.fade')};
        }

        /* Circular indeterminate animation */
        ${c('circular')}${c('indeterminate')} ${c('fill')} {
          animation: ${c('circular', 'animation')} 1s linear infinite;
        }

        @keyframes ${c('circular', 'animation')} {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `;
    },
  },
});
