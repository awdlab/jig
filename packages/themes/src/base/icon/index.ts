import { createThemePart, css } from '@awdlab/jig-themes/api';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        width: 1em;
        height: 1em;
        display: flex;
        svg {
          fill: currentColor;
          width: 100%;
          height: 100%;
        }
      }
      ${c('default')} {
        width: 1em;
        height: 1em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        svg {
          fill: currentColor;
          width: 100%;
          height: 100%;
        }
      }
      /* Mirror directional slots in RTL, keyed off the slot so consumer overrides are mirrored too. */
      ${c('root')}:dir(rtl) {
        &[data-default-icon='breadcrumb-separator'],
        &[data-default-icon='calendar-previous-month'],
        &[data-default-icon='calendar-next-month'],
        &[data-default-icon='menu-submenu'],
        &[data-default-icon='paginator-previous'],
        &[data-default-icon='paginator-next'],
        &[data-default-icon='table-group-toggle'],
        &[data-default-icon='tabs-scroll-start'],
        &[data-default-icon='tabs-scroll-end'] {
          scale: -1 1;
        }
      }
    `,
  },
});
