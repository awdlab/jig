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
        align-items: center;
      }
      ${c('operator')} {
        min-width: 0;
      }
      ${c('value')} {
        min-width: 0;
        flex: 1 1 auto;
      }
      ${c('remove-btn')} {
        flex: 0 0 auto;
      }
      ${c('condition-divider')} {
        display: flex;
        align-items: center;
        width: 100%;
        user-select: none;
      }
      ${c('condition-divider')}::before,
      ${c('condition-divider')}::after {
        content: '';
        flex: 1;
        height: 1px;
      }
      ${c('summary')} {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      ${c('footer')} {
        display: flex;
        flex-wrap: wrap;
        min-width: 0;
        align-items: center;
      }
      ${c('footer-actions')} {
        display: flex;
        margin-left: auto;
      }
      ${c('active-indicator')} {
        position: absolute;
        pointer-events: none;
      }
    `,
  },
});
