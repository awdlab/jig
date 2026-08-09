import { createThemePart, css } from '@awdlab/jig-themes/api';
import { globalControlTemplate } from '@awdlab/jig-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  root: {
    css: ({ v, c }) => css`
      --awd-color-scrollbar-thumb: var(--awd-color-surface-300);
      --awd-color-scrollbar-track: transparent;
      --awd-color-scrollbar: var(--awd-color-scrollbar-thumb) var(--awd-color-scrollbar-track);
      ${c('root')} {
        /* styles for all awd controls go here */
        * {
          scrollbar-color: var(--awd-color-scrollbar);
        }
      }
      .awd-control.awd-control-initializing {
        /*
         * Hide controls until they are fully initialized to prevent FOUC
         * The 'awd-control-initialized' class is added in a afterNextRender callback in NgnBase.
         */
        display: none !important;
      }
    `,
  },
});
