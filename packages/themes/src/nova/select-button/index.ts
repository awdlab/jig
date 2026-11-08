import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { selectButtonControlTemplate } from '@awdlab/jig-themes/templates/select-button';

export const selectButtonStyles = createThemePart({
  controlTemplate: selectButtonControlTemplate,
  base: baseStyles.selectButton,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      /* Border on the fit-content orientation element so it hugs the buttons; radius +1px so their corners nest inside. */
      ${d('group', 'horizontal')}, ${d('group', 'vertical')} {
        border: 1px solid ${v('color.border')};
        border-radius: calc(${v('size.rounded.md')} + 1px);
      }
      ${c('invalid')} ${d('group', 'horizontal')},
      ${c('invalid')} ${d('group', 'vertical')} {
        border-color: ${v('color.invalid.border')};
      }
    `,
  },
});
