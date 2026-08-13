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
      /* The preferred width is the *uncollapsed* content size, so a shrink-to-fit parent
         wraps the full toolbar and cannot wrap the collapsed one to drive further
         collapsing. max-width lets a real constraint win, which is when collapsing is
         wanted. An author-set width overrides both, as it should.
         Outside popover mode the variable is unset and the toolbar simply fills. */
      ${c('root')} {
        display: block;
        width: var(--jig-toolbar-content-width, 100%);
        max-width: 100%;
      }
      /* A vertical toolbar can only overflow if something bounds its height, and
         that bound comes from the host's parent — so the host has to take it. */
      ${c('root')}:has(> ${c('vertical')}) {
        height: 100%;
      }
      ${c('grid')} {
        display: grid;
        gap: 0.5rem;
      }
      /* minmax(0, ...) is what makes a track's size independent of its own content.
         Without it a track sizes to min-content, the collapse budget follows the
         collapse decision, and the layout oscillates. The center track needs it
         for a second reason: a plain auto track is unbounded and never overflows. */
      ${c('horizontal')} {
        grid-template-columns: minmax(0, 1fr) minmax(0, auto) minmax(0, 1fr);
        align-items: center;
      }
      ${c('vertical')} {
        grid-template-rows: minmax(0, 1fr) minmax(0, auto) minmax(0, 1fr);
        justify-items: center;
        height: 100%;
      }
      /* Equal side tracks are what centers the middle one — but with nothing in the
         middle there is nothing to center, and reserving an equal end track would
         starve the start track of space it could use. The overflow trigger lives in
         every track, so it does not count as content. */
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
      ${c('wrap')} {
        & ${c('placement-start')},
        & ${c('placement-center')},
        & ${c('placement-end')} {
          flex-wrap: wrap;
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
        left: -9999px;
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
