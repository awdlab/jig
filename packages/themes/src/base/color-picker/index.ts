import { createThemePart, css } from '@awdlab/jig-themes/api';
import { colorPickerControlTemplate } from '@awdlab/jig-themes/templates/color-picker';

export const colorPickerStyles = createThemePart({
  controlTemplate: colorPickerControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: inline-block;
      }
      ${c('preview')} {
        /* the trigger sets width/height:100% on this span — inline elements ignore those, so
           without this the color box collapses to nothing */
        display: block;
      }
      ${c('panel')} {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 18rem;
        /* Dragging the SV/hue/alpha surfaces must not select surrounding text. */
        user-select: none;
        -webkit-user-select: none;
      }
      ${c('sv-area')} {
        position: relative;
        width: 100%;
        height: 10rem;
        touch-action: none;
        cursor: crosshair;
        /* --hue is set by the component (0..360) */
        background:
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(var(--hue), 100%, 50%));
      }
      ${c('sv-thumb')}, ${c('hue-thumb')}, ${c('alpha-thumb')} {
        position: absolute;
        pointer-events: none;
        transform: translate(-50%, -50%);
      }
      ${c('hue-track')}, ${c('alpha-track')} {
        margin-inline: 0.5rem;
      }
      ${c('hue-track')} {
        position: relative;
        height: 0.75rem;
        touch-action: none;
        cursor: pointer;
        background: linear-gradient(
          to right,
          #f00 0%,
          #ff0 17%,
          #0f0 33%,
          #0ff 50%,
          #00f 67%,
          #f0f 83%,
          #f00 100%
        );
      }
      ${c('alpha-track')} {
        position: relative;
        height: 0.75rem;
        touch-action: none;
        cursor: pointer;
      }
      ${c('hue-thumb')}, ${c('alpha-thumb')} {
        top: 50%;
      }
      ${c('swatches')} {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
      }
      ${c('fields')} {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }
      ${c('channels')} {
        display: flex;
        gap: 0.25rem;
        flex: 1;
        min-width: 0;
      }
      ${c('channel')} {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        flex: 1;
        min-width: 0;
      }
      /* The single hex box needs more room than the numeric channel boxes. */
      ${c('channel-hex')} {
        flex: 3;
      }
      ${c('channel')} jig-input-field {
        width: 100%;
      }
      /* Compact horizontal padding so 3-digit channel values (e.g. 246) aren't clipped. */
      ${c('channel')} input {
        padding-inline: 0.25rem;
      }
      ${c('channel-label')} {
        font-size: 0.7rem;
        line-height: 1;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      ${c('format-toggle')} {
        flex: none;
      }
    `,
  },
});
