import { createThemePart, css } from '@ngneers/controls-themes/api';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { tooltipControlTemplate } from '@ngneers/controls-themes/templates/tooltip';

export const tooltipStyles = createThemePart({
  controlTemplate: tooltipControlTemplate,
  dependencies: [animationTemplate, colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        // Browser-Reset:
        width: unset;
        height: unset;
        color: unset;
        background-color: unset;
        inset: unset;
        margin: unset;
        border-width: unset;
        border-style: unset;
        border-color: unset;
        border-image: unset;
        padding: unset;
        overflow: unset;
      }

      ${c('content')} {
        background: ${v('color.surface.950')};
        color: ${v('color.surface.50')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.md')};
        position: relative;
      }

      ${c('text')} {
        pointer-events: none;
      }

      ${c('with-arrow')} {
        --arrow-width: 16px;

        &::before {
          content: '';
          background: ${v('color.surface.950')};
          position: absolute;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          width: var(--arrow-width);
          height: var(--arrow-width);
        }

        &${c('left')} {
          padding-right: calc(var(--arrow-width) / 2);
          &::before {
            right: 0;
            top: var(--anchor-center);
            transform: translateY(-50%);
          }
        }

        &${c('right')} {
          padding-left: calc(var(--arrow-width) / 2);
          &::before {
            left: 0;
            top: var(--anchor-center);
            transform: translateY(-50%);
          }
        }

        &${c('top')} {
          padding-bottom: calc(var(--arrow-width) / 2);
          &::before {
            bottom: 0;
            left: var(--anchor-center);
            transform: translateX(-50%);
          }
        }

        &${c('bottom')} {
          padding-top: calc(var(--arrow-width) / 2);
          &::before {
            top: 0;
            left: var(--anchor-center);
            transform: translateX(-50%);
          }
        }
      }

      ${c()}:popover-open {
        animation: ngn-tooltip-fade-in ${v('animation.duration.fade')} ${v('animation.easing.fade')}
          forwards;
      }

      ${c('closing')}:popover-open {
        pointer-events: none;
        animation: ngn-tooltip-fade-out ${v('animation.duration.fade')}
          ${v('animation.easing.fade')} forwards;
      }

      @keyframes ngn-tooltip-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes ngn-tooltip-fade-out {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `,
  },
});
