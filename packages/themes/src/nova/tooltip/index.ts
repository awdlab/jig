import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { tooltipControlTemplate } from '@ngneers/controls-themes/templates/tooltip';

export const tooltipStyles = createThemePart({
  controlTemplate: tooltipControlTemplate,
  base: baseStyles.tooltip,
  dependencies: [animationTemplate, colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('content')} {
        background: ${v('color.surface.950')};
        color: ${v('color.surface.950-contrast')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.md')};
        white-space: pre-line;
      }

      ${c('with-arrow')} {
        --arrow-width: 16px;
        &::before {
          background: ${v('color.surface.950')};
        }
      }

      ${c('root')}:popover-open {
        animation: ngn-tooltip-fade-in ${v('anim.time.fade')} ${v('anim.ease.fade')} forwards;
      }

      ${c('closing')}:popover-open {
        animation: ngn-tooltip-fade-out ${v('anim.time.fade')} ${v('anim.ease.fade')} forwards;
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
