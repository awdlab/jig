import { createThemePart, css } from '@ngneers/controls-themes/api';
import { ratingControlTemplate } from '@ngneers/controls-themes/templates/rating';

export const ratingStyles = createThemePart({
  controlTemplate: ratingControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-flex;
        align-items: center;
        gap: 0.125rem;
      }
      ${c('symbol')} {
        position: relative;
        display: inline-block;
        line-height: 1;
      }
      ${c('empty')} {
        display: block;
      }
      ${c('full')} {
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        overflow: hidden;
        white-space: nowrap;
        /* --fillRatio is set per symbol in the template, 0..1 */
        width: calc(var(--fillRatio) * 100%);
      }
    `,
  },
});
