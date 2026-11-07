import { createThemePart, css } from '@awdlab/jig-themes/api';
import { toolbarControlTemplate } from '@awdlab/jig-themes/templates/toolbar';

export const toolbarStyles = createThemePart({
  controlTemplate: toolbarControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      :has(> ${c('root')}) {
        min-width: 0;
      }
      /* The width must come from the container, never from the content. A shrink-to-fit
         parent would otherwise size the host to its *collapsed* content: items collapse,
         the host narrows, more items collapse, until only the trigger is left. */
      /* Prefers the uncollapsed width so a shrink-to-fit parent cannot drive further collapsing. */
      ${c('root')} {
        display: block;
        width: var(--jig-toolbar-content-width, 100%);
        max-width: 100%;
      }
      /* Same trade on the block axis: prefer the uncollapsed content height, let a real
         bound from the parent win. A vertical toolbar can only overflow if something
         bounds its height. */
      ${c('root')}:has(> ${c('vertical')}) {
        height: var(--jig-toolbar-content-height, 100%);
        max-height: 100%;
      }
      ${c('grid')} {
        display: grid;
        gap: 0.5rem;
      }
      /* minmax(0, ...) decouples track sizes from their content, preventing collapse oscillation. */
      ${c('horizontal')} {
        grid-template-columns: minmax(0, 1fr) minmax(0, auto) minmax(0, 1fr);
        align-items: center;
      }
      ${c('vertical')} {
        grid-template-rows: minmax(0, 1fr) minmax(0, auto) minmax(0, 1fr);
        justify-items: center;
        height: 100%;
      }
      /* Without center content, drop the equal end track so the start track keeps its space. */
      ${c('horizontal')}:not(
      :has(> ${c('placement-center')} > :not([data-jig-toolbar-overflow]))
      ) {
        grid-template-columns: minmax(0, 1fr) 0 minmax(0, auto);
      }
      ${c('vertical')}:not(
      :has(> ${c('placement-center')} > :not([data-jig-toolbar-overflow]))
      ) {
        grid-template-rows: minmax(0, 1fr) 0 minmax(0, auto);
      }
      ${c('placement-start')}, ${c('placement-center')}, ${c('placement-end')} {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
        min-height: 0;
      }
      ${c('horizontal')} {
        & ${c('placement-start')} {
          justify-content: flex-start;
        }
        & ${c('placement-center')} {
          justify-content: center;
        }
        & ${c('placement-end')} {
          justify-content: flex-end;
        }
      }
      ${c('vertical')} {
        & ${c('placement-start')},
        & ${c('placement-center')},
        & ${c('placement-end')} {
          flex-direction: column;
        }
        & ${c('placement-start')} {
          justify-content: flex-start;
        }
        & ${c('placement-center')} {
          justify-content: center;
        }
        & ${c('placement-end')} {
          justify-content: flex-end;
        }
      }
      /* Wrap mode is one wrapping flex row in which each placement wraps as a group. */
      ${c('horizontal')}${c('wrap')} {
        display: flex;
        flex-wrap: wrap;
        & ${c('placement-start')},
        & ${c('placement-end')} {
          /* Equal zero-basis growth centers the middle placement; the min-width makes each placement wrap as a whole. */
          flex: 1 0 0;
          min-width: fit-content;
        }
        & ${c('placement-center')} {
          flex: 0 0 auto;
        }
      }
      ${c('wrap')} {
        & ${c('placement-start')},
        & ${c('placement-center')},
        & ${c('placement-end')} {
          flex-wrap: wrap;
          max-width: 100%;
        }
      }
      ${c('overflow-trigger')} {
        display: flex;
        align-items: center;
      }
      /* Kept in the layout but off-screen so it still reports a real size —
         display:none would measure 0 and the collapse budget would be wrong. */
      ${c('overflow-trigger-hidden')} {
        position: absolute;
        top: -9999px;
        inset-inline-start: -9999px;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }
      ${c('popover-content')} {
        display: flex;
        flex-direction: column;
      }
    `,
  },
});
