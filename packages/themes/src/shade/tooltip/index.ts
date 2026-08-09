import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { tooltipControlTemplate } from '@awdlab/jig-themes/templates/tooltip';

export const tooltipStyles = createThemePart({
  controlTemplate: tooltipControlTemplate,
  base: baseStyles.tooltip,
  dependencies: [animationTemplate, colorsTemplate, fontTemplate, sizesTemplate],
  root: {
    // Inverted surface: dark-on-light schemes get a black tooltip with white text and vice versa.
    // Uses the surface slot inverted (not primary) so the tooltip stays neutral regardless of a
    // customized primary/base color.
    css: ({ v, c }) => css`
      ${c('content')} {
        background: ${v('color.surface.foreground')};
        color: ${v('color.surface.base')};
        border-radius: ${v('size.rounded.md')};
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        font-size: ${v('font.size.xs')};
        white-space: pre-line;
      }

      ${c('with-arrow')} {
        --arrow-width: 10px;
        &::before {
          background: ${v('color.surface.foreground')};
        }
      }

      ${c('root')}:popover-open {
        animation: ${c('fade-in', 'animation')} ${v('anim.time.fade')} ${v('anim.ease.fade')}
          forwards;
      }

      ${c('closing')}:popover-open {
        animation: ${c('fade-out', 'animation')} ${v('anim.time.fade')} ${v('anim.ease.fade')}
          forwards;
      }

      @keyframes ${c('fade-in', 'animation')} {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes ${c('fade-out', 'animation')} {
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
