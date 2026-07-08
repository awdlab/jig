import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { domEventHandler } from '@ngneers/controls/api/ng';
import { NgnPt, provideSelf, ValueControlBase } from '@ngneers/controls/base';
import { I18n } from '@ngneers/controls/i18n';
import { NgnRovingGroup, NgnRovingItem } from '@ngneers/controls/roving-focus';
import { maskInputControlTemplate } from '@ngneers/controls-themes/templates/mask-input';

import {
  composeDisplay,
  deserialize,
  fieldList,
  isComplete,
  nearestSectionIndex,
  paste,
  resolveMask,
  serialize,
  stepSection,
  truncateGaps,
  typeIntoSection,
} from './helper';

import type { MaskInputCfg } from './types';

/**
 * @category control
 */
@Component({
  selector: 'ngn-mask-input',
  templateUrl: './mask-input.html',
  imports: [NgnPt, NgnRovingGroup, NgnRovingItem],
  providers: [provideSelf(NgnMaskInput)],
})
export class NgnMaskInput extends ValueControlBase<'maskInput', string | null> {
  public override readonly isFieldControl = true;
  protected readonly theme = this.injectThemeTemplate(maskInputControlTemplate, 'root');
  protected readonly i18n = inject(I18n).translations;

  /**
   * The mask to apply to the input. Can be a predefined mask key or a custom mask configuration.
   */
  public readonly mask = input<MaskInputCfg | string | null>(null);

  private readonly _parts = computed(() => resolveMask(this.mask()));

  private readonly _fields = computed(() => {
    const p = this._parts();
    return p ? fieldList(p) : [];
  });

  /**
   * Structural signature of the resolved mask — field kinds/names/widths and
   * separators, but deliberately NOT numeric min/max. The section values are
   * reset only when this changes, so a consumer narrowing a field's range (e.g.
   * a calendar shrinking the day field's max to the current month's length) does
   * not wipe what the user has already typed.
   */
  private readonly _structureSig = computed(() => {
    const parts = this._parts();
    if (!parts) return '';
    return parts
      .map(p =>
        p.kind === 'sep'
          ? `sep:${p.text}`
          : p.kind === 'number'
            ? `num:${p.name}:${p.maxLen}:${p.pad}`
            : `enum:${p.name}:${p.values.join('|')}`
      )
      .join(';');
  });

  /** Source of truth: one raw string per field ordinal. */
  protected readonly values = signal<string[]>([]);

  /** Whether the proxy input currently holds focus. The active-section
   * highlight and "actively edited" treatment only apply while focused. */
  protected readonly focused = signal(false);

  /** RenderTokens for template @for loop. While unfocused there is no active
   * section, so padded fields render in their resting (padded) form. */
  protected readonly tokens = computed(() => {
    const p = this._parts();
    if (!p) return [];
    return composeDisplay(p, this.values(), this.focused() ? this.activeOrd() : undefined);
  });

  /** The roving group on the proxy input element. */
  protected readonly rovingGroup = viewChild.required(NgnRovingGroup);

  /** The proxy input element reference. */
  private readonly _proxyRef = viewChild.required<ElementRef<HTMLInputElement>>('proxy');

  /** Active field ordinal (identity: item index === field ordinal). */
  protected readonly activeOrd = computed(() => this.rovingGroup().activeIndex());

  protected readonly proxyInputMode = computed(() => {
    const f = this._fields()[this.activeOrd()];
    return f?.kind === 'enum' ? 'text' : 'numeric';
  });

  protected readonly liveAnnouncement = signal<string>('');

  // ---- A11y helpers ----

  protected sectionValueNow(ord: number): number | null {
    const f = this._fields()[ord];
    const v = this.values()[ord] ?? '';
    if (!f || v === '') return null;
    if (f.kind === 'number') return Number(v);
    // enum: expose the option index so the spinbutton has a valid numeric value.
    const idx = f.values.indexOf(v);
    return idx >= 0 ? idx : null;
  }

  protected sectionMin(ord: number): number | null {
    const f = this._fields()[ord];
    if (!f) return null;
    return f.kind === 'number' ? f.min : 0;
  }

  protected sectionMax(ord: number): number | null {
    const f = this._fields()[ord];
    if (!f) return null;
    return f.kind === 'number' ? f.max : f.values.length - 1;
  }

  protected sectionValueText(ord: number): string {
    const f = this._fields()[ord];
    const v = this.values()[ord] ?? '';
    if (!f) return '';
    if (v === '') return f.placeholder;
    return v;
  }

  /**
   * Whether every section holds a finished value — i.e. the mask is fully
   * filled and a serialized output value has been emitted.
   */
  public readonly complete = computed(() => this.value() !== null);

  /** Whether no section holds any value (the whole field is blank). Lets a host
   * (e.g. calendar) distinguish a fully-cleared field from mid-typing, both of
   * which emit a `null` value. */
  public readonly empty = computed(() => this.values().every(v => v === ''));

  /**
   * Returns the resolved CSS class string for `section-active` from the theme,
   * used to highlight the currently active section span in the template.
   */
  protected readonly activeSectionClass = computed(() => this.theme.class('section-active'));

  // ---- Segment descriptions for sr ----

  protected readonly segmentDescriptions = computed(() => {
    const parts = this._parts();
    if (!parts) return [];
    return fieldList(parts).map(field => ({
      id: `seg-${field.name}-${this.inputId()}`,
      text:
        field.kind === 'number'
          ? this.i18n['maskInput_segmentRange']({
              name: field.name,
              min: field.min,
              max: field.max,
            })
          : field.values.join(this.i18n['maskInput_optionSeparator']()),
    }));
  });

  /** Returns the description span id for a given field ordinal, or null if none. */
  protected sectionDescId(ord: number): string | null {
    return this.segmentDescriptions()[ord]?.id ?? null;
  }

  constructor() {
    super();

    // Reset values only when the mask STRUCTURE changes (not a min/max-only
    // tweak), synchronously before the next render, so stale values from a
    // different mask are never composed against the new parts.
    let prevStructureSig: string | null = null;
    effect(() => {
      const sig = this._structureSig();
      if (prevStructureSig !== null && prevStructureSig !== sig) {
        this.values.set([]);
      }
      prevStructureSig = sig;
    });

    // External value → internal: guard against write-loop by comparing to serialized form.
    // Use untracked() when reading `values` so that internal typing changes do NOT re-trigger
    // this effect — it must only fire when the external `value` model (from the parent) changes.
    effect(() => {
      const parts = this._parts();
      if (!parts) return;
      const ext = this.value() ?? '';
      const current = untracked(() =>
        isComplete(parts, this.values()) ? serialize(parts, this.values()) : ''
      );
      if (ext !== current) {
        this.values.set(deserialize(parts, ext));
      }
    });

    // Internal values → external value model.
    effect(() => {
      const parts = this._parts();
      if (!parts) return;
      const vals = this.values();
      if (isComplete(parts, vals)) {
        this.value.set(serialize(parts, vals));
      } else {
        this.value.set(null);
      }
    });

    // Wire DOM events on the proxy input.
    domEventHandler(this._proxyRef, 'beforeinput', event => this._onBeforeInput(event));
    domEventHandler(this._proxyRef, 'keydown', event => this._onKeyDown(event));

    // Track focus so the active-section highlight only shows while focused.
    domEventHandler(this._proxyRef, 'focus', () => this.focused.set(true));
    domEventHandler(this._proxyRef, 'blur', () => this.focused.set(false));

    // Pointer down anywhere on the control: focus the proxy and select the
    // section nearest the pointer. Shared with field-delegated clicks via
    // `focusFromPointer`. Works standalone (no surrounding input-field).
    domEventHandler(this.element, 'pointerdown', event => {
      if (this.disabled()) return;
      event.preventDefault();
      this.focusFromPointer(event);
    });
  }

  /**
   * Places focus on the proxy input and selects the section nearest the
   * pointer's horizontal position. Invoked both by the control's own
   * `pointerdown` and by a surrounding `ngn-input-field` when its padding is
   * clicked (so a click "above" a section selects that section). Returns `true`
   * to signal the field it handled focus.
   */
  public override focusFromPointer(event: MouseEvent): boolean {
    if (this.disabled()) return false;
    this._proxyRef().nativeElement.focus();
    const ord = this._sectionIndexAt(event.clientX);
    if (ord >= 0) this.rovingGroup().setActive(ord);
    return true;
  }

  /** Clears every section (invoked by a surrounding field's clear button). */
  public override clearValue(): boolean {
    if (this.disabled() || this.readonly()) return false;
    this.values.set([]);
    return true;
  }

  /** Field ordinal of the section nearest `clientX`, or -1 when there are none. */
  private _sectionIndexAt(clientX: number): number {
    // Section spans carry role="spinbutton" and appear in DOM order = field
    // ordinal order (matching the activeOrd identity mapping).
    const spans = this.element.nativeElement.querySelectorAll<HTMLElement>('[role="spinbutton"]');
    const rects = Array.from(spans, el => el.getBoundingClientRect());
    return nearestSectionIndex(rects, clientX);
  }

  private _onBeforeInput(event: InputEvent): void {
    const parts = this._parts();
    if (!parts) return;
    if (this.disabled() || this.readonly()) return;

    event.preventDefault();

    if (event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
      const r = event.data ? paste(parts, event.data) : null;
      if (r) {
        this.values.set(r.values);
        // Advance to the next empty section or stay on last
        const fields = this._fields();
        const nextEmpty = r.values.findIndex(v => v === '');
        const targetOrd = nextEmpty >= 0 ? nextEmpty : fields.length - 1;
        this.rovingGroup().setActive(targetOrd);
      }
      return;
    }

    if (event.data) {
      const ord = this.activeOrd();
      const fields = this._fields();
      const f = fields[ord];
      if (!f) return;
      const current = this.values()[ord] ?? '';
      const r = typeIntoSection(f, current, event.data);
      if (r) {
        // Immutable update of the values array
        const newValues = [...this.values()];
        newValues[ord] = r.value;
        this.values.set(newValues);
        if (r.advance) {
          this.rovingGroup().next();
        }
      }
    }
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const parts = this._parts();
    if (!parts || event.ctrlKey || event.metaKey || event.altKey) return;
    if (this.disabled() || this.readonly()) return;

    const ord = this.activeOrd();
    const fields = this._fields();
    const f = fields[ord];

    switch (event.key) {
      case 'Backspace':
      case 'Delete': {
        event.preventDefault();
        const currentVal = this.values()[ord] ?? '';
        if (currentVal === '') {
          // Already empty — step to previous section
          this.rovingGroup().prev();
        } else {
          // Clear the active section; then enforce no-gaps so any filled
          // fields after the newly-emptied one are also cleared.
          const newValues = [...this.values()];
          newValues[ord] = '';
          this.values.set(truncateGaps(newValues));
        }
        break;
      }
      case 'ArrowUp':
      case 'ArrowDown': {
        // The roving group is configured with horizontal orientation, so it
        // deliberately does NOT consume ArrowUp/ArrowDown — the mask owns them
        // for value stepping. This division is intentional, not coincidental:
        // Left/Right move between sections, Up/Down change the active value.
        event.preventDefault();
        if (!f) break;
        const dir: 1 | -1 = event.key === 'ArrowUp' ? 1 : -1;
        const newVal = stepSection(f, this.values()[ord] ?? '', dir);
        const newValues = [...this.values()];
        newValues[ord] = newVal;
        this.values.set(newValues);
        this.liveAnnouncement.set(`${f.name}: ${newVal}`);
        break;
      }
      // ArrowLeft/Right/Home/End are handled by the roving group — do not preventDefault
    }
  }
}
