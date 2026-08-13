import { createThemePart, css } from '@awdlab/jig-themes/api';
import { skeletonControlTemplate } from '@awdlab/jig-themes/templates/skeleton';

export const skeletonStyles = createThemePart({
  controlTemplate: skeletonControlTemplate,
  dependencies: [],
  root: {
    // Purely functional: a flat block at the authored size. Animation is a themed concern.
    css: ({ c }) => css`
      ${c('root')} {
        box-sizing: border-box;
        display: block;
        width: var(--width);
        height: var(--height);
        /* Inset paints inside the box, keeping the total at the authored height. A theme
           restating the background shorthand must restate background-clip with it. */
        padding-block: var(--inset);
        border-radius: var(--radius, 0.25rem);
        background: currentColor;
        background-clip: content-box;
        opacity: 0.1;
      }
    `,
  },
});
