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
      /* The segmented control reads as one bounded unit, so the border goes around the whole group.
         It must sit on the group's inner orientation element — that is the one with
         width: fit-content, so it hugs the buttons. The host and the group root are both full-width
         blocks and would stretch the border across whatever flex/grid the consumer uses. The radius
         is one px larger than the buttons' so their corners nest inside the border — deliberately
         not overflow: hidden, which would clip the buttons' focus rings. */
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
