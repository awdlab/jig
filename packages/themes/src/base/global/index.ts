import { createThemePart, css } from '@awdlab/jig-themes/api';
import { globalControlTemplate } from '@awdlab/jig-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  root: {
    css: ({ v, c }) => css`
      /* Keep the UA scheme in sync with the .dark class, not the OS. Otherwise UA-painted
         bits (text selection, scrollbars, native controls) use the wrong scheme's colors. */
      color-scheme: light;
      --jig-color-scrollbar-thumb: var(--jig-color-surface-300);
      --jig-color-scrollbar-track: transparent;
      --jig-color-scrollbar: var(--jig-color-scrollbar-thumb) var(--jig-color-scrollbar-track);
      ${c('root')} {
        /* styles for all jig controls go here */
        * {
          scrollbar-color: var(--jig-color-scrollbar);
        }
      }
      .jig-control.jig-control-initializing {
        /*
         * Hide controls until they are fully initialized to prevent FOUC
         * The 'jig-control-initialized' class is added in a afterNextRender callback in JigBase.
         */
        display: none !important;
      }
    `,
  },
  dark: {
    css: () => css`
      color-scheme: dark;
    `,
  },
});
