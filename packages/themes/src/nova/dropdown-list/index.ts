import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { dropdownListControlTemplate } from '@awdlab/jig-themes/templates/dropdown-list';

export const dropdownListStyles = createThemePart({
  controlTemplate: dropdownListControlTemplate,
  base: baseStyles.dropdownList,
  dependencies: [sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('header')} {
        margin: ${v('size.padding.md')};
      }
    `,
  },
});
