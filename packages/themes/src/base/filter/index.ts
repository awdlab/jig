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
        min-width: 0;
      }
      ${c('value')} {
        min-width: 0;
        max-width: 100%;
      }
      ${c('row-actions')} {
        display: flex;
        flex: 0 0 auto;
      }
      ${c('summary')} {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ${c('match')} {
        min-width: 0;
      }
      ${c('footer')} {
        display: flex;
        flex-wrap: wrap;
        min-width: 0;
      }
    `,
  },
});
