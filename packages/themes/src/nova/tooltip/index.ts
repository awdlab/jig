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
      }

      ${c('text')} {
        pointer-events: none;
      }

      ${c()}:popover-open {
        animation: ngn-tooltip-fade-in ${v('animation.duration.fade')} ${v('animation.easing.fade')}
          forwards;
      }

      ${c('closing')}:popover-open {
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
