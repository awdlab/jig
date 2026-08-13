import { createThemePart, css } from '@awdlab/jig-themes/api';
import { scrollShadowDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

export const scrollShadowStyles = createThemePart({
  controlTemplate: scrollShadowDirectiveTemplate,
  dependencies: [],
  root: {
    // Structural overlay. The `overlay` layer is a zero-size sticky box pinned to the scroll
    // viewport's top-left corner; `surface` is an absolutely-positioned cover sized to the viewport
    // (via the --jig-scroll-shadow-w/h vars the directive sets). Each edge is painted as a 12px
    // gradient strip, enabled per-edge by the scrolled-* classes — the exact same gradient formula
    // consumers can reuse (see the table's sticky-column edges). Only the tint
    // (--jig-scroll-shadow-color) is theme-defined (nova/shade); everything here is structural.
    css: ({ c }) => css`
      ${c('overlay')} {
        position: sticky;
        top: 0;
        inset-inline-start: 0;
        z-index: 1;
        width: 0;
        /* Empty, so auto height is zero in a block container. In a flex one it stretches
           instead of being centred, which would drag the surface past the bottom edge. */
        height: auto;
        align-self: stretch;
        overflow: visible;
        pointer-events: none;
      }
      ${c('overlay')}${c('unstyled')} {
        display: none;
      }
      ${c('surface')} {
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: var(--jig-scroll-shadow-w, 0);
        height: var(--jig-scroll-shadow-h, 0);
        pointer-events: none;
        background-repeat: no-repeat;
        background-position: left, right, top, bottom;
        background-size:
          12px 100%,
          12px 100%,
          100% 12px,
          100% 12px;
        background-image:
          var(--jig-scroll-shadow-start, none), var(--jig-scroll-shadow-end, none),
          var(--jig-scroll-shadow-top, none), var(--jig-scroll-shadow-bottom, none);
        transition: background-image 0.15s ease;
      }
      /* Neither background-position nor gradient direction has a logical form, so mirror the
         whole decorative layer: the start/end strips swap edges AND fade direction in one go.
         The top/bottom strips are full-width, so a horizontal flip leaves them unchanged. */
      ${c('surface')}:dir(rtl) {
        transform: scaleX(-1);
      }
      ${c('scrolled-start')} ${c('surface')} {
        --jig-scroll-shadow-start: linear-gradient(
          to right,
          var(--jig-scroll-shadow-color),
          transparent
        );
      }
      ${c('scrolled-end')} ${c('surface')} {
        --jig-scroll-shadow-end: linear-gradient(
          to left,
          var(--jig-scroll-shadow-color),
          transparent
        );
      }
      ${c('scrolled-top')} ${c('surface')} {
        --jig-scroll-shadow-top: linear-gradient(
          to bottom,
          var(--jig-scroll-shadow-color),
          transparent
        );
      }
      ${c('scrolled-bottom')} ${c('surface')} {
        --jig-scroll-shadow-bottom: linear-gradient(
          to top,
          var(--jig-scroll-shadow-color),
          transparent
        );
      }
    `,
  },
});
