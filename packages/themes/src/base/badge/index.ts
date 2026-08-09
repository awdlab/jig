import { createThemePart, css } from '@awdlab/jig-themes/api';
import { badgeControlTemplate } from '@awdlab/jig-themes/templates/badge';

export const badgeStyles = createThemePart({
  controlTemplate: badgeControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        position: absolute;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        box-sizing: border-box;
        z-index: 1;
      }
      ${c('top-end')} {
        top: 0;
        inset-inline-end: 0;
        transform: translate(50%, -50%);
      }
      ${c('top-start')} {
        top: 0;
        inset-inline-start: 0;
        transform: translate(-50%, -50%);
      }
      ${c('bottom-end')} {
        bottom: 0;
        inset-inline-end: 0;
        transform: translate(50%, 50%);
      }
      ${c('bottom-start')} {
        bottom: 0;
        inset-inline-start: 0;
        transform: translate(-50%, 50%);
      }
      /* Circular anchors (e.g. avatars): sit the badge on the circle's edge at ~45°
         instead of the bounding-box corner. 14.64% ≈ (1 - cos45°) * radius inset. */
      ${c('circular')}${c('top-end')} {
        top: 14.64%;
        inset-inline-end: 14.64%;
      }
      ${c('circular')}${c('top-start')} {
        top: 14.64%;
        inset-inline-start: 14.64%;
      }
      ${c('circular')}${c('bottom-end')} {
        bottom: 14.64%;
        inset-inline-end: 14.64%;
      }
      ${c('circular')}${c('bottom-start')} {
        bottom: 14.64%;
        inset-inline-start: 14.64%;
      }
    `,
  },
});
