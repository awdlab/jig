import { createThemePart, css } from '@ngneers/controls-themes/api';
import { globalControlTemplate } from '@ngneers/controls-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  root: {
    css: ({ v, c }) => css`
      --ngn-color-scrollbar-thumb: var(--ngn-color-surface-300);
      --ngn-color-scrollbar-track: transparent;
      --ngn-color-scrollbar: var(--ngn-color-scrollbar-thumb) var(--ngn-color-scrollbar-track);
      ${c('root')} {
        /* styles for all ngn controls go here */
        * {
          scrollbar-color: var(--ngn-color-scrollbar);
        }
      }
      .ngn-control.ngn-control-initializing {
        /*
         * Hide controls until they are fully initialized to prevent FOUC
         * The 'ngn-control-initialized' class is added in a afterNextRender callback in NgnBase.
         */
        display: none !important;
      }
    `,
  },
});
