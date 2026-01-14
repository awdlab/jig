import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { progressControlTemplate } from '@ngneers/controls-themes/templates/progress';

export const progressStyles = createThemePart({
  controlTemplate: progressControlTemplate,
  base: baseStyles.progress,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => {
      void d;
      return css`
        ${c()} {
          height: 0.5rem;
        }
        ${c('track')} {
          background: ${v('color.surface.200')};
          border-radius: ${v('size.rounded.md')};
          height: 100%;
        }
        ${c('fill')}, ${c('fill2')} {
          background: ${v('color.primary.500')};
          border-radius: ${v('size.rounded.md')};
          transition: width ${v('anim.time.fade')} ${v('anim.ease.fade')};
          height: 100%;
        }
        ${c('indeterminate')} {
          ${c('fill')}, ${c('fill2')} {
            position: absolute;
          }
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
        ${c('circular')} {
          height: auto;
          display: inline-flex;
        }
        ${c('circular')} ${c('svg')} {
          display: block;
        }
        ${c('circular')} ${c('track')} {
          stroke: ${v('color.surface.200')};
          background: none;
        }
        ${c('circular')} ${c('fill')} {
          stroke: ${v('color.primary.500')};
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
