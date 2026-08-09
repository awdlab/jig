import { createThemePart, css } from '@awdlab/jig-themes/api';
import { stateControlTemplate } from '@awdlab/jig-themes/templates/state';

export const stateStyles = createThemePart({
  controlTemplate: stateControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        display: none;
        flex: 0 0 auto;
        width: var(--awd-state-size, 1em);
        height: var(--awd-state-size, 1em);
        color: currentColor;
        font-size: var(--awd-state-size, 1em);
        line-height: 1;
        vertical-align: -0.125em;
      }

      ${c('visible')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      ${c('indicator')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      ${c('sr-only')} {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
        pointer-events: none;
      }

      ${c('root')} ${d('icon')},
      ${c('root')} ${d('spinner')} {
        width: 100%;
        height: 100%;
        color: inherit;
      }

      ${d('button', 'root')}:has(> ${c('replace-content')}${c('visible')}) {
        position: relative;
        -webkit-text-fill-color: transparent;
      }

      ${d('button', 'root')}:has(> ${c('replace-content')}${c('visible')})
      > :not(${c('root')}) {
        visibility: hidden;
      }

      ${d('button', 'root')} > ${c('replace-content')}${c('visible')} {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 0;
        font-size: var(--awd-state-size, 1em);
        transform: translate(-50%, -50%);
        -webkit-text-fill-color: currentColor;
      }

      ${d('input-field', 'root')} > ${c('root')} {
        --awd-state-hit-padding: 0.25rem;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        width: calc(var(--awd-state-size, 1em) + var(--awd-state-hit-padding) * 2);
        height: calc(var(--awd-state-size, 1em) + var(--awd-state-hit-padding) * 2);
        padding: var(--awd-state-hit-padding);
        margin-block: calc(var(--awd-state-hit-padding) * -1);
        margin-inline-start: calc(0.375em - var(--awd-state-hit-padding));
        margin-inline-end: calc(var(--awd-state-hit-padding) * -1);
      }

      ${d('input-field', 'root')} > ${c('visible')} {
        visibility: visible;
      }
    `,
  },
});
