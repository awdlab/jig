import { createThemePart, css } from '@awdlab/jig-themes/api';
import { sliderControlTemplate } from '@awdlab/jig-themes/templates/slider';

export const sliderStyles = createThemePart({
  controlTemplate: sliderControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        --trackHitSize: 2rem;
        user-select: none;
        display: flex;
      }
      ${c('track')} {
        position: relative;
        /* Keeps the press area out of the surrounding scrollable overflow. */
        contain: layout;
      }
      ${c('root')}:not([disabled]):not(${c('readonly')}) ${c('track')} {
        cursor: pointer;
        /* Invisible press area, so the thin track needs no pixel-precise aim. */
        &::before {
          content: '';
          position: absolute;
        }
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
        width: 100%;
        max-height: min-content;
        ${c('track')} {
          width: calc(100% - var(--thumbSize));
          height: var(--trackThickness);
          margin: calc((var(--thumbSize) - var(--trackThickness)) / 2) calc(var(--thumbSize) / 2);
        }
        ${c('track')}::before {
          inset-block: calc((var(--trackThickness) - var(--trackHitSize)) / 2);
          inset-inline: calc(var(--thumbSize) / -2);
        }
        ${c('fill')} {
          height: 100%;
          inset-block-start: 0;
          inset-inline-start: var(--startPercent);
          width: calc(var(--valuePercent) - var(--startPercent));
        }
        ${c('thumb')} {
          inset-inline-start: calc(var(--valuePercent) - var(--thumbSize) / 2);
          inset-block-start: 50%;
          transform: translateY(-50%);
        }
      }
      ${c('vertical')} {
        height: 100%;
        max-width: min-content;
        ${c('track')} {
          height: calc(100% - var(--thumbSize));
          width: var(--trackThickness);
          margin: calc(var(--thumbSize) / 2) calc((var(--thumbSize) - var(--trackThickness)) / 2);
        }
        ${c('track')}::before {
          inset-inline: calc((var(--trackThickness) - var(--trackHitSize)) / 2);
          inset-block: calc(var(--thumbSize) / -2);
        }
        ${c('fill')} {
          width: 100%;
          inset-inline-start: 0;
          inset-block-end: var(--startPercent);
          height: calc(var(--valuePercent) - var(--startPercent));
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
