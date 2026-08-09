import { createThemePart, css } from '@awdlab/jig-themes/api';
import { radioGroupControlTemplate } from '@awdlab/jig-themes/templates/radio-group';

export const radioGroupStyles = createThemePart({
  controlTemplate: radioGroupControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        flex-direction: row;
        gap: 0.75rem;
      }
      ${c('root')}[aria-orientation='vertical'] {
        flex-direction: column;
      }
    `,
  },
});
