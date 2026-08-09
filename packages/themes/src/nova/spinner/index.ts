import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate, themedColors } from '@awdlab/jig-themes/nova/base';
import { spinnerControlTemplate } from '@awdlab/jig-themes/templates/spinner';

export const spinnerStyles = createThemePart({
  controlTemplate: spinnerControlTemplate,
  base: baseStyles.spinner,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        color: var(--theme-color-500);
      }

      ${c('svg')} {
        animation: ${c('svg', 'animation')} 2000ms linear infinite;
        transform-origin: 50% 50%;
      }
      ${c('circle')} {
        --strokeWidth: var(--thickness, calc(var(--size) * 1px / 90 + 32px / 9));
        --r: calc(var(--size) * 1px / 2 - var(--strokeWidth) / 2);
        --1deg: calc(2 * pi * var(--r) / 360);
        r: var(--r);
        stroke-width: var(--strokeWidth);
        animation: ${c('circle', 'animation')} 1400ms ease-in-out infinite;
        transform-origin: 50% 50%;
        stroke: currentColor;

        stroke-linecap: round;
      }
      @keyframes ${c('circle', 'animation')} {
        0% {
          stroke-dasharray: calc(5 * var(--1deg)) calc(355 * var(--1deg));
          transform: rotate(0);
        }
        50% {
          stroke-dasharray: calc(270 * var(--1deg)) calc(90 * var(--1deg));
          transform: rotate(90deg);
        }
        100% {
          stroke-dasharray: calc(5 * var(--1deg)) calc(355 * var(--1deg));
          transform: rotate(360deg);
        }
      }
      @keyframes ${c('svg', 'animation')} {
        0% {
          transform: rotate(0);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  },
});
