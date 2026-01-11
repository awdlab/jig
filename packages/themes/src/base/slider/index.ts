import { createThemePart, css } from '@ngneers/controls-themes/api';
import { sliderControlTemplate } from '@ngneers/controls-themes/templates/slider';

export const sliderStyles = createThemePart({
  controlTemplate: sliderControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        user-select: none;
        display: flex;
      }
      ${c('track')} {
        position: relative;
      }
      ${c('fill')} {
        position: absolute;
      }
      ${c('thumb')} {
        position: absolute;
        width: var(--thumbSize);
        height: var(--thumbSize);
      }
      ${c('horizontal')} {
        ${c('track')} {
          width: calc(100% - var(--thumbSize));
          height: var(--trackThickness);
          margin: calc((var(--thumbSize) - var(--trackThickness)) / 2) calc(var(--thumbSize) / 2);
        }
        ${c('fill')} {
          height: 100%;
          inset-block-start: 0;
          inset-inline-start: 0;
          width: var(--valuePercent);
        }
        ${c('thumb')} {
          inset-inline-start: calc(var(--valuePercent) - var(--thumbSize) / 2);
          inset-block-start: 50%;
          transform: translateY(-50%);
        }
      }
      ${c('vertical')} {
        ${c('track')} {
          height: calc(100% - var(--thumbSize));
          width: var(--trackThickness);
          margin: calc(var(--thumbSize) / 2) calc((var(--thumbSize) - var(--trackThickness)) / 2);
        }
        ${c('fill')} {
          width: 100%;
          inset-block-end: 0;
          inset-inline-start: 0;
          height: var(--valuePercent);
        }
        ${c('thumb')} {
          inset-block-end: calc(var(--valuePercent) - var(--thumbSize) / 2);
          inset-inline-start: 50%;
          transform: translateX(-50%);
        }
      }
    `,
  },
});
