import { createThemePart, css } from '@ngneers/controls-themes/api';
import { stepperControlTemplate } from '@ngneers/controls-themes/templates/stepper';

export const stepperStyles = createThemePart({
  controlTemplate: stepperControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: flex;
        flex-direction: column;
      }
      ${c('header')} {
        display: flex;
        align-items: center;
      }
      ${c('step')} {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
      }
      ${c('step')}[disabled] {
        cursor: default;
      }
      ${c('connector')} {
        flex: 1 1 auto;
        height: 1px;
      }
      ${c('marker')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
    `,
  },
});
