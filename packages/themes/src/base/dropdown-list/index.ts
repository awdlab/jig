import { createThemePart, css } from '@awdlab/jig-themes/api';
import { dropdownListControlTemplate } from '@awdlab/jig-themes/templates/dropdown-list';

export const dropdownListStyles = createThemePart({
  controlTemplate: dropdownListControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('content')} {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      /* No projected header means no gap above the list. */
      ${c('header')}:empty {
        display: none;
      }
      ${c('root')} ${d('popover', 'content')} {
        padding: 0;
      }
      ${c('root')} ${d('list-box')} {
        border-width: 0;
      }
    `,
  },
});
