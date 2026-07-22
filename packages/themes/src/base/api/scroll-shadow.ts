import { createThemePart, css } from '@ngneers/controls-themes/api';
import { scrollShadowDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

export const scrollShadowStyles = createThemePart({
  controlTemplate: scrollShadowDirectiveTemplate,
  dependencies: [],
  root: {
    // Structural overlay. The `overlay` layer is a zero-size sticky box pinned to the scroll
    // viewport's top-left corner; `surface` is an absolutely-positioned cover sized to the viewport
    // (via the --ngn-scroll-shadow-w/h vars the directive sets). Each edge is painted as a 12px
    // gradient strip, enabled per-edge by the scrolled-* classes — the exact same gradient formula
    // consumers can reuse (see the table's sticky-column edges). Only the tint
    // (--ngn-scroll-shadow-color) is theme-defined (nova/shade); everything here is structural.
    css: ({ c }) => css`
      ${c('overlay')} {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 1;
        width: 0;
        height: 0;
        overflow: visible;
        pointer-events: none;
      }
      ${c('overlay')}${c('unstyled')} {
        display: none;
      }
      ${c('surface')} {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--ngn-scroll-shadow-w, 0);
        height: var(--ngn-scroll-shadow-h, 0);
        pointer-events: none;
        background-repeat: no-repeat;
        background-position: left, right, top, bottom;
        background-size:
          12px 100%,
          12px 100%,
          100% 12px,
          100% 12px;
        background-image:
          var(--ngn-scroll-shadow-start, none), var(--ngn-scroll-shadow-end, none),
          var(--ngn-scroll-shadow-top, none), var(--ngn-scroll-shadow-bottom, none);
        transition: background-image 0.15s ease;
      }
      ${c('scrolled-start')} ${c('surface')} {
        --ngn-scroll-shadow-start: linear-gradient(
          to right,
          var(--ngn-scroll-shadow-color),
          transparent
        );
      }
      ${c('scrolled-end')} ${c('surface')} {
        --ngn-scroll-shadow-end: linear-gradient(
          to left,
          var(--ngn-scroll-shadow-color),
          transparent
        );
      }
      ${c('scrolled-top')} ${c('surface')} {
        --ngn-scroll-shadow-top: linear-gradient(
          to bottom,
          var(--ngn-scroll-shadow-color),
          transparent
        );
      }
      ${c('scrolled-bottom')} ${c('surface')} {
        --ngn-scroll-shadow-bottom: linear-gradient(
          to top,
          var(--ngn-scroll-shadow-color),
          transparent
        );
      }
    `,
  },
});
