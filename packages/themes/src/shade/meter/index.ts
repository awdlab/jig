import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { meterControlTemplate } from '@awdlab/jig-themes/templates/meter';

export const meterStyles = createThemePart({
  controlTemplate: meterControlTemplate,
  base: baseStyles.meter,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate],
  root: {
    // Shade is monochrome: the palette walks the primary ramp instead of switching hue.
    // The levels interleave (dark, mid, dark, light, …) so neighbouring segments never
    // land on adjacent tones and stay distinguishable in both schemes.
    css: ({ v, c }) => css`
      ${c('root')} {
        --meter-palette-1: ${v('color.primary.900')};
        --meter-palette-2: ${v('color.primary.500')};
        --meter-palette-3: ${v('color.primary.700')};
        --meter-palette-4: ${v('color.primary.300')};
        --meter-palette-5: ${v('color.primary.800')};
        --meter-palette-6: ${v('color.primary.400')};
        --meter-palette-7: ${v('color.primary.600')};
        --meter-palette-8: ${v('color.primary.200')};
        gap: ${v('size.padding.lg')};
        font-size: ${v('font.size.sm')};
        color: ${v('color.foreground')};
      }

      ${c('track')} {
        overflow-clip-margin: 4px;
        background: ${v('color.muted.base')};
        border-radius: ${v('size.rounded.full')};
      }
      ${c('horizontal')} ${c('track')} {
        height: 0.5rem;
      }
      ${c('vertical')} ${c('track')} {
        width: 0.5rem;
        min-height: 6rem;
      }

      ${c('segment')} {
        transition:
          width ${v('anim.time.fade')} ${v('anim.ease.fade')},
          height ${v('anim.time.fade')} ${v('anim.ease.fade')},
          transform ${v('anim.time.fade')} ${v('anim.ease.fade')};
      }
      /* Monochrome makes the hairline load-bearing: without it two ramp levels merge into
         one block. It is the segment's own border, never an overlapping shadow — a lifted
         segment paints above its siblings and would swallow theirs. */
      ${c('horizontal')} ${c('segment')} + ${c('segment')} {
        border-inline-start: 1px solid ${v('color.muted.base')};
      }
      ${c('vertical')} ${c('segment')} + ${c('segment')} {
        border-block-end: 1px solid ${v('color.muted.base')};
      }
      /* The filled run ends in a cap; the track's own radius rounds the other end. */
      ${c('horizontal')} ${c('segment')}:last-child {
        border-start-end-radius: ${v('size.rounded.full')};
        border-end-end-radius: ${v('size.rounded.full')};
      }
      ${c('vertical')} ${c('segment')}:last-child {
        border-start-start-radius: ${v('size.rounded.full')};
        border-start-end-radius: ${v('size.rounded.full')};
      }

      /* Highlight lifts the segment clear of the bar. \`:not(:hover)\` keeps a segment from
         moving out from under its own pointer, so the lift only answers a legend hover. */
      ${c('horizontal')} ${c('segment')}${c('highlighted')}:not(:hover) {
        transform: translateY(-3px);
      }
      ${c('vertical')} ${c('segment')}${c('highlighted')}:not(:hover) {
        transform: translateX(-3px);
      }
      /* A halo instead of padding: the row keeps its box, so nothing shifts on hover. */
      ${c('item')}${c('highlighted')} {
        background: ${v('color.muted.base')};
        border-radius: ${v('size.rounded.md')};
        box-shadow: 0 0 0 0.25rem ${v('color.muted.base')};
      }
      ${c('item')}${c('highlighted')} ${c('value')} {
        color: ${v('color.foreground')};
      }

      ${c('legend')} {
        gap: ${v('size.padding.md')} ${v('size.padding.xl')};
      }

      ${c('item')} {
        gap: ${v('size.padding.md')};
        line-height: 1.25;
      }

      ${c('swatch')} {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: ${v('size.rounded.full')};
      }

      ${c('icon')} {
        color: ${v('color.muted.foreground')};
        font-size: 1rem;
      }

      ${c('label')} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      ${c('value')} {
        color: ${v('color.muted.foreground')};
        font-weight: ${v('font.weight.medium')};
        font-variant-numeric: tabular-nums;
      }
    `,
  },
});
