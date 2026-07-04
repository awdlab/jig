import { createThemePart, css } from '@ngneers/controls-themes/api';
import { uploadControlTemplate } from '@ngneers/controls-themes/templates/upload';

export const uploadStyles = createThemePart({
  controlTemplate: uploadControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => {
      return css`
        ${c('root')} {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }
        /* File-list placement relative to the drop zone. */
        ${c('list-top')},
        ${c('list-bottom')} {
          flex-direction: column;
        }
        ${c('list-left')},
        ${c('list-right')} {
          flex-direction: row;
        }
        ${c('list-top')} ${c('list')},
        ${c('list-left')} ${c('list')} {
          order: -1;
        }

        /* Drop zone + manual footer column. */
        ${c('main')} {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1 1 auto;
          min-width: 0;
        }

        /* Projected native input: the real, focusable control. Visually hidden
           but overlaid on the whole zone so a click anywhere opens the picker
           and keyboard focus lands on it. */
        ${c('root')} input[type='file'] {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          border: 0;
          opacity: 0;
          cursor: inherit;
          /* Only accept pointer input when clicking is an allowed interaction. */
          pointer-events: none;
        }
        ${c('clickable')} input[type='file'] {
          pointer-events: auto;
        }

        ${c('zone')} {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-align: center;
        }
        ${c('clickable')} ${c('zone')} {
          cursor: pointer;
        }

        ${c('disabled')} {
          pointer-events: none;
        }

        ${c('list')} {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: 14rem;
          min-width: 0;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        /* Beside the zone: share the row width. */
        ${c('list-left')} ${c('list')},
        ${c('list-right')} ${c('list')} {
          flex: 1 1 auto;
        }

        ${c('item')} {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        ${c('file')} {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }
        ${c('name')} {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        ${c('progress')} {
          width: 100%;
        }

        ${c('actions')} {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 0.25rem;
        }

        ${c('footer')} {
          display: flex;
          justify-content: flex-end;
        }
      `;
    },
  },
});
