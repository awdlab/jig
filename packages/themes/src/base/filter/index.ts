import { createThemePart, css } from '@ngneers/controls-themes/api';
import { filterControlTemplate } from '@ngneers/controls-themes/templates/filter';

export const filterStyles = createThemePart({
  controlTemplate: filterControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('popover-content')} {
        display: flex;
        flex-direction: column;
        min-width: 0;
        max-width: 100%;
      }
      ${c('rows')} {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      ${c('row')} {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        min-width: 0;
      }
      ${c('operator')} {
        order: 2;
        min-width: 0;
      }
      ${c('value')} {
        order: 3;
        min-width: 0;
        max-width: 100%;
      }
      ${c('row-actions')} {
        order: 1;
        display: flex;
        flex: 0 0 auto;
      }
      ${c('summary')} {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ${c('actions')} {
        display: flex;
        flex-wrap: wrap;
      }
      ${c('match')} {
        min-width: 0;
      }
    `,
  },
});
