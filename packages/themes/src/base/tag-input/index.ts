import { createThemePart, css } from '@awdlab/jig-themes/api';
import { tagInputControlTemplate } from '@awdlab/jig-themes/templates/tag-input';

export const tagInputStyles = createThemePart({
  controlTemplate: tagInputControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        width: 100%;
        align-self: stretch;
        min-width: 0;
      }
      /* The field wrapper is the flex line and, in single-line mode, the scroll
         container — the tag row itself must not scroll, because a scrolling row
         collapses to a zero min-content width and gets squeezed by the text field. */
      /* Claims the field's horizontal padding the way a plain input does, so the scroll
         viewport — and with it the scroll shadow — reaches the field's border instead of
         stopping a padding's width short of it. The inset moves onto the row's own content
         (below), because padding on a scroll container would trap the sticky shadow overlay
         inside the content box. */
      ${c('field')} {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: calc(100% + 2 * var(--fieldPadX, 0px));
        min-width: 0;
        margin-inline: calc(-1 * var(--fieldPadX, 0px));
      }
      ${c('field')}:has(${c('single-line')}) {
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
      }
      ${c('field')}:has(${c('multiline')}) {
        flex-wrap: wrap;
      }
      /* Padding, not margin: it is the row's leading inset and has to scroll away with it. */
      /* Unselectable: a pan across the row would otherwise drag-select the tag text, and the
         browser then autoscrolls towards a pointer held past the edge, fighting the pan. */
      ${c('tags')} {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
        padding-inline-start: var(--fieldPadX, 0px);
        list-style: none;
        user-select: none;
      }
      ${c('tags')}:empty {
        display: none;
      }
      ${c('single-line')} {
        flex-wrap: nowrap;
      }
      ${c('multiline')} {
        flex-wrap: wrap;
      }
      ${c('tag')} {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        flex: 0 0 auto;
      }
      /* Stretching the button gives the small icon the tag's full height as a hit area. */
      ${c('tag-remove')} {
        display: inline-flex;
        align-items: center;
        align-self: stretch;
        padding: 0;
        background: none;
        border: 0;
        cursor: pointer;
      }
      /* The text field is sized by what has been typed, so it takes no more of the row than
         it needs and tags wrap or scroll tightly; it still grows into whatever is left. The
         field's vertical padding stays unclaimed — claiming it makes the input taller than
         the scroll container, which then scrolls vertically. */
      ${c('field')} ${d('input')} {
        field-sizing: content;
        flex: 1 1 auto;
        border-width: 0;
        outline: none;
        background: transparent;
        margin-block: 0;
        padding-block: 0;
        /* Last in the row, so its padding carries the trailing inset. A theme overrides the
           leading one to a small gap whenever tags precede it. */
        padding-inline: var(--fieldPadX, 0px);
        width: unset;
      }
      /* Without content sizing the input's default preferred width would drive the row, so
         keep the fixed floor those engines had. */
      @supports not (field-sizing: content) {
        ${c('field')} ${d('input')} {
          flex: 1 0 6rem;
          min-width: 6rem;
        }
      }
      ${c('live-region')} {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
        border: 0;
      }
    `,
  },
});
