import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { Anchor, Openable } from '@awdlab/jig/api/ng';
import { NgnPt, provideSelf, ValueControlBase } from '@awdlab/jig/base';
import { NgnButton } from '@awdlab/jig/button';
import { NgnDrag, type NgnDragInfo } from '@awdlab/jig/directives';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnNumberInput } from '@awdlab/jig/number-input';
import { NgnPopover } from '@awdlab/jig/popover';
import {
  type ColorFormat,
  formatColor,
  hsvaToRgba,
  type HSVA,
  NgnError,
  parseColor,
  type RGBA,
  rgbaToHsva,
} from '@awdlab/jig/utils';
import { colorPickerControlTemplate } from '@awdlab/jig-themes/templates/color-picker';

const DEFAULT_HSVA: HSVA = { h: 0, s: 0, v: 0, a: 1 };

/**
 * @category control
 */
@Component({
  selector: 'awd-color-picker',
  templateUrl: './color-picker.html',
  imports: [
    NgTemplateOutlet,
    NgnPt,
    NgnDrag,
    NgnPopover,
    NgnInput,
    NgnButton,
    NgnInputField,
    NgnNumberInput,
  ],
  providers: [provideSelf(NgnColorPicker)],
  host: {
    '[style.--hue]': 'hsva().h',
    '(focusout)': 'potentiallyBlurred()',
  },
})
export class NgnColorPicker extends ValueControlBase<'color-picker', string> implements Openable {
  protected readonly theme = this.injectThemeTemplate(colorPickerControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    disabled: () => this.disabled(),
    inline: () => this.inline(),
  });

  private readonly _svArea = viewChild<ElementRef<HTMLElement>>('svArea');
  private readonly _hueTrack = viewChild<ElementRef<HTMLElement>>('hueTrack');
  private readonly _alphaTrack = viewChild<ElementRef<HTMLElement>>('alphaTrack');
  // Only rendered (non-`inline()`) behind the trigger — absent while inline.
  private readonly _popover = viewChild(NgnPopover);

  /** Output/display format. @default hex */
  public readonly format = input<ColorFormat>('hex');
  /** Show the alpha channel. @default true */
  public readonly alpha = input(true, { transform: booleanAttribute });
  /** Preset swatch colors. */
  public readonly swatches = input<string[]>();
  /** Render the panel inline instead of behind a trigger. @default false */
  public readonly inline = input(false, { transform: booleanAttribute });
  /**
   * Headless mode: render no trigger of its own and open in a popover anchored to
   * {@link anchor}, driven imperatively via {@link show}/{@link hide}/{@link toggle}
   * (like `awd-menu`). Requires {@link anchor}. @default false
   */
  public readonly popover = input(false, { transform: booleanAttribute });
  /** The external element the headless popover anchors to. Required when {@link popover} is set. */
  public readonly anchor = input<Anchor>();
  /** Open state of the popover (headless or built-in trigger); two-way bindable. @default false */
  public readonly open = model(false);
  /** Emits when the popover has fully closed (part of the `Openable` contract). */
  public readonly closed = output<void>();

  /** Internal HSVA source of truth. */
  protected readonly hsva = signal<HSVA>(DEFAULT_HSVA);

  /** The format the text field/toggle currently displays; seeded from {@link format}. */
  protected readonly activeFormat = signal<ColorFormat>('hex');

  /** Current color as a CSS string for previews. */
  protected readonly cssColor = computed(() => {
    const rgba = hsvaToRgba(this.hsva());
    return formatColor(rgba, 'rgb', true);
  });

  /** The last value string this component itself wrote via {@link commit}. */
  private _lastCommitted: string | null = null;

  /**
   * The raw text the user is currently typing in the hex/value field, or `null`
   * when not editing. While editing, the field shows this verbatim (so a short
   * form like `#ff0` isn't reformatted mid-typing) even though the color updates
   * live from it.
   */
  protected readonly editText = signal<string | null>(null);

  constructor() {
    super();
    // Sync incoming value → hsva, but only for externally-set values. `commit()` quantizes to
    // integer RGB, so re-deriving HSVA from our OWN writes at s=0/v=0 (achromatic) would recover
    // h=0 and stomp the hue the user just dragged away from — skip re-parsing anything we set.
    effect(() => {
      const v = this.value();
      if (v == null || v === this._lastCommitted) {
        return;
      }
      const rgba = parseColor(v);
      if (rgba) {
        this.hsva.set(rgbaToHsva(rgba));
      }
    });
    effect(() => this.activeFormat.set(this.format()));

    // Headless popover requires an anchor (mirrors awd-menu).
    effect(() => {
      if (this.popover() && !this.anchor()) {
        throw new NgnError('NgnColorPicker', 'popover mode requires the anchor input to be set.');
      }
    });
    // Two-way bridge between the `open` model and the actual popover state.
    effect(() => {
      const shouldOpen = this.open();
      const pop = this._popover();
      if (!pop) return;
      if (shouldOpen && !pop.open()) pop.show();
      else if (!shouldOpen && pop.open()) pop.hide();
    });
  }

  /** Open the popover (headless or built-in trigger). */
  public show(): void {
    this._popover()?.show();
  }
  /** Close the popover. */
  public hide(): void {
    this._popover()?.hide();
  }
  /** Toggle the popover. */
  public toggle(): void {
    this._popover()?.toggle();
  }

  /** Commit the current HSVA to the model value, formatted in the currently active format. */
  private commit(): void {
    const rgba = hsvaToRgba(this.hsva());
    const formatted = formatColor(rgba, this.activeFormat(), this.alpha() && rgba.a < 1);
    this._lastCommitted = formatted;
    this.value.set(formatted);
  }

  /**
   * Set the color from an RGBA and commit, preserving the current hue when the new color is
   * achromatic (s=0 or v=0). Otherwise the RGB→HSV round-trip collapses hue to 0, so it would be
   * lost the moment a channel/swatch edit lands on a grey/black — mirrors the SV-drag path, which
   * keeps hue in the `hsva` signal. `alpha` defaults to the incoming rgba's alpha.
   */
  private setFromRgba(rgba: RGBA, alpha = rgba.a): void {
    const prev = this.hsva();
    const next = rgbaToHsva(rgba);
    const h = next.s === 0 || next.v === 0 ? prev.h : next.h;
    this.hsva.set({ ...next, h, a: alpha });
    this.commit();
  }

  protected onSvDrag(info: NgnDragInfo): void {
    if (this.readonly() || this.disabled()) return;
    const el = this._svArea()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp01((info.absoluteX - rect.left) / rect.width);
    const v = clamp01(1 - (info.absoluteY - rect.top) / rect.height);
    this.hsva.update(c => ({ ...c, s, v }));
    this.commit();
  }

  protected onHueDrag(info: NgnDragInfo): void {
    if (this.readonly() || this.disabled()) return;
    const el = this._hueTrack()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = clamp01((info.absoluteX - rect.left) / rect.width) * 360;
    this.hsva.update(c => ({ ...c, h }));
    this.commit();
  }

  protected onAlphaDrag(info: NgnDragInfo): void {
    if (this.readonly() || this.disabled()) return;
    const el = this._alphaTrack()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const a = clamp01((info.absoluteX - rect.left) / rect.width);
    this.hsva.update(c => ({ ...c, a }));
    this.commit();
  }

  protected selectSwatch(color: string): void {
    if (this.readonly() || this.disabled()) return;
    const rgba = parseColor(color);
    if (rgba) {
      this.setFromRgba(rgba);
    }
  }

  protected toggleOpen(): void {
    if (this.disabled() || this.readonly()) return;
    this._popover()?.toggle();
  }

  /** Popover `closed` handler: run the blur check and re-emit for consumers. */
  protected onPopoverClosed(): void {
    this.potentiallyBlurred();
    this.closed.emit();
  }

  // Popover content lives outside the normal DOM focus flow, so a plain host `blur` can't tell a
  // real blur from focus moving into the panel — mirror `select`'s popover-aware check instead.
  protected potentiallyBlurred(): void {
    setTimeout(() => {
      if (this.element.nativeElement.contains(document.activeElement) || this._popover()?.open()) {
        return;
      }
      this.markTouched();
    });
  }

  protected cycleFormat(): void {
    const order: ColorFormat[] = ['hex', 'rgb', 'hsl'];
    const i = order.indexOf(this.activeFormat());
    this.activeFormat.set(order[(i + 1) % order.length]!);
    // Re-emit in the new format so the value isn't silently locked to the old one — but only
    // once a value has actually been established, so cycling on an empty picker stays inert.
    if (this.value() != null) {
      this.commit();
    }
  }

  protected readonly textValue = computed(() =>
    formatColor(hsvaToRgba(this.hsva()), this.activeFormat(), this.alpha() && this.hsva().a < 1)
  );

  /**
   * What the hex/value field displays: the user's in-progress text while editing,
   * otherwise the canonical formatted value.
   */
  protected readonly displayText = computed(() => this.editText() ?? this.textValue());

  /**
   * Per-keystroke handler: keep the field showing the raw text, but update the color
   * live from it when it parses. The field is NOT reformatted while typing.
   */
  protected onHexInput(text: string | null): void {
    if (this.readonly() || this.disabled()) return;
    this.editText.set(text ?? '');
    const rgba = parseColor(text ?? '');
    if (rgba) {
      this.hsva.set(rgbaToHsva(rgba));
      this.commit();
    }
  }

  /** Commit handler (change / Enter / blur): apply the final text and normalize the field. */
  protected onHexCommit(text: string | null): void {
    if (!this.readonly() && !this.disabled()) {
      const rgba = parseColor(text ?? '');
      if (rgba) {
        this.hsva.set(rgbaToHsva(rgba));
        this.commit();
      }
    }
    // Leave editing → the field re-syncs to the canonical `textValue()`.
    this.editText.set(null);
  }

  // --- Per-channel inputs (Chrome-style RGB/HSL boxes) ---

  /** RGBA channel values for the RGB boxes. r/g/b are 0–255. */
  protected readonly rgbaChannels = computed(() => {
    const c = hsvaToRgba(this.hsva());
    return { r: Math.round(c.r), g: Math.round(c.g), b: Math.round(c.b) };
  });

  /** HSL channel values for the HSL boxes. h 0–360, s/l 0–100 (%). */
  protected readonly hslChannels = computed(() => {
    const { h, s, v } = this.hsva();
    const l = v * (1 - s / 2);
    const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    return { h: Math.round(h), s: Math.round(sl * 100), l: Math.round(l * 100) };
  });

  /** Alpha as an integer percentage (0–100) for the alpha box. */
  protected readonly alphaPercent = computed(() => Math.round(this.hsva().a * 100));

  protected setRgbChannel(ch: 'r' | 'g' | 'b', value: number | null): void {
    if (this.readonly() || this.disabled() || value == null) return;
    const c = hsvaToRgba(this.hsva());
    const patched = { ...c, [ch]: Math.min(255, Math.max(0, value)) };
    this.setFromRgba(patched, c.a);
  }

  protected setHslChannel(ch: 'h' | 's' | 'l', value: number | null): void {
    if (this.readonly() || this.disabled() || value == null) return;
    if (ch === 'h') {
      this.hsva.update(c => ({ ...c, h: Math.min(360, Math.max(0, value)) }));
      this.commit();
      return;
    }
    const cur = this.hslChannels();
    const s = ch === 's' ? Math.min(100, Math.max(0, value)) : cur.s;
    const l = ch === 'l' ? Math.min(100, Math.max(0, value)) : cur.l;
    const rgba = parseColor(`hsl(${this.hsva().h}, ${s}%, ${l}%)`);
    if (rgba) {
      this.setFromRgba(rgba, this.hsva().a);
    }
  }

  protected setAlphaPercent(value: number | null): void {
    if (this.readonly() || this.disabled() || value == null) return;
    this.hsva.update(c => ({ ...c, a: Math.min(100, Math.max(0, value)) / 100 }));
    this.commit();
  }

  // Thumb positions (0..100%) for the template.
  protected readonly svThumbLeft = computed(() => this.hsva().s * 100);
  protected readonly svThumbTop = computed(() => (1 - this.hsva().v) * 100);
  protected readonly hueThumbLeft = computed(() => (this.hsva().h / 360) * 100);
  protected readonly alphaThumbLeft = computed(() => this.hsva().a * 100);
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}
