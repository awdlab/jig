import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { tooltipControlTemplate } from '@awdlab/jig-themes/templates/tooltip';

export const tooltipStyles = createThemePart({
  controlTemplate: tooltipControlTemplate,
  base: baseStyles.tooltip,
  dependencies: [animationTemplate, colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('content')} {
        background: ${v('color.surface.950')};
        color: ${v('color.surface.950-contrast')};
        border-radius: ${v('size.rounded.sm')};
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        font-size: ${v('font.size.xs')};
        white-space: pre-line;
      }

      ${c('with-arrow')} {
        --arrow-width: 10px;
        &::before {
          background: ${v('color.surface.950')};
        }
      }

      ${c('root')}:popover-open {
        animation: awd-tooltip-fade-in ${v('anim.time.fade')} ${v('anim.ease.fade')} forwards;
      }

      ${c('closing')}:popover-open {
        animation: awd-tooltip-fade-out ${v('anim.time.fade')} ${v('anim.ease.fade')} forwards;
      }

      @keyframes awd-tooltip-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes awd-tooltip-fade-out {
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
