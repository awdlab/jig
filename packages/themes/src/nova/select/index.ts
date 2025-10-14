import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        --icon-size: 14px;
      }
      ${c('input')} ${d('input-field')} {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        gap: ${v('size.padding.sm')};
        align-items: center;
        white-space: nowrap;
      }
      ${c('icon')} {
        color: ${v('color.surface.500')};
        cursor: pointer;
      }
      ${c('combobox')} {
        width: 100%;
      }
      ${c('filter-icon')} {
        color: ${v('color.surface.500')};
      }
      ${c('input-editable')} ${d('input-field')} {
        cursor: text;
      }
      ${c('popover-content')} {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      ${c('filter')} {
        margin: ${v('size.padding.md')};
      }
      ${c('')} ${d('popover', 'content')} {
        padding: 0;
      }
      ${c('list-box')}${d('list-box')} {
        border-width: 0;
      }
      ${c('no-items')} {
        text-align: center;
        padding: ${v('size.padding.md')};
      }
      ${c('list-box')}${c('list-box-empty')} ${d('list-box', 'scroller')} {
        padding: 0;
      }
    `,
  },
});
