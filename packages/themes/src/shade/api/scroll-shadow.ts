import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { scrollShadowDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

// The scroll-shadow tint is the single source of truth for the shadow color. It is defined on the
// scroll container's scrolled-* classes so both the generic overlay surface and any consumer
// painting its own shadows off those classes (e.g. the table's sticky-column edges) inherit the
// exact same value.
export const scrollShadowStyles = createThemePart({
  controlTemplate: scrollShadowDirectiveTemplate,
  base: baseStyles.scrollShadow,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('scrolled-start')},
      ${c('scrolled-end')},
      ${c('scrolled-top')},
      ${c('scrolled-bottom')} {
        --jig-scroll-shadow-color: rgb(0 0 0 / 0.08);
      }
    `,
  },
  dark: {
    // Dark surfaces are near-black; a black fade is invisible against them, so the tint flips to
    // white. 0.35 reads clearly without glowing. ponytail: tune this alpha if it's too strong/weak.
    css: ({ c }) => css`
      ${c('scrolled-start')},
      ${c('scrolled-end')},
      ${c('scrolled-top')},
      ${c('scrolled-bottom')} {
        --jig-scroll-shadow-color: rgb(255 255 255 / 0.35);
      }
    `,
  },
});
