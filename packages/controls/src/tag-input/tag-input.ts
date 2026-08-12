import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  inject,
  Injector,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { JigTemplate } from '@awdlab/jig/api/ng';
import { JigPt, provideSelf } from '@awdlab/jig/base';
import { JigDragScroll } from '@awdlab/jig/directives';
import { JigDropdownList } from '@awdlab/jig/dropdown-list';
import { JigIcon } from '@awdlab/jig/icon';
import { I18n } from '@awdlab/jig/i18n';
import { JigInput } from '@awdlab/jig/input';
import { JigRovingGroup, JigRovingItem } from '@awdlab/jig/roving-focus';
import { JigScrollShadow } from '@awdlab/jig/scroll-shadow';
import { maybeCallback } from '@awdlab/jig/utils';
import { asyncComputed, debounceSignal, explicitEffect } from '@awdlab/jig/utils-ng';
import { tagInputControlTemplate } from '@awdlab/jig-themes/templates/tag-input';

import { TagInputTemplates } from './tag-input-templates';

import type {
  TagRejection,
  TagRejectionReason,
  TagSuggestions,
  TagSuggestionsResult,
} from './types';
import type { JigItem } from '@awdlab/jig/api';
import type { PopoverOptions } from '@awdlab/jig/popover';
import type { IconType } from '@awdlab/jig-custom-types';

/** Keys the suggestion list handles rather than the text field. */
const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'];

/** `numberAttribute` that keeps `undefined`/`null`/`''` as "no bound". */
function optionalNumberAttribute(value: unknown): number | undefined {
  return value == null || value === '' ? undefined : numberAttribute(value);
}

/** What the live region can report. */
type AnnouncementKind = 'added' | 'removed' | TagRejectionReason;

/**
 * A list of string tags the user types and confirms. Enter always commits;
 * further characters can be declared as {@link delimiters}. Designed to sit
 * inside a `jig-input-field`, like `jig-select`.
 *
 * The value is `null` while there are no tags — never an empty array — so
 * signal-forms `required` reacts to it. Count and per-tag length are validated
 * with the `tagCount` and `tagLength` validators this entry point exports.
 *
 * @category control
 */
@Component({
  selector: 'jig-tag-input',
  templateUrl: './tag-input.html',
  imports: [
    JigPt,
    JigIcon,
    JigInput,
    JigTemplate,
    JigRovingGroup,
    JigRovingItem,
    JigDragScroll,
    JigDropdownList,
    JigScrollShadow,
    NgTemplateOutlet,
  ],
  providers: [provideSelf(JigTagInput)],
  host: {
    style: 'display: block;',
  },
})
export class JigTagInput extends TagInputTemplates {
  public override readonly isFieldControl = true;
  protected readonly theme = this.injectThemeTemplate(tagInputControlTemplate, {
    root: true,
    invalid: () => this.invalidState(),
    empty: () => this.empty(),
    full: () => this.full(),
  });
  protected readonly i18n = inject(I18n).translations;

  private readonly _injector = inject(Injector);
  private readonly _rovingGroup = viewChild<JigRovingGroup>(JigRovingGroup);
  private readonly _dropdown =
    viewChild<JigDropdownList<readonly JigItem<unknown, string>[]>>(JigDropdownList);

  /** The element the suggestion dropdown anchors to: the wrapping field, if any. */
  protected get anchorElement(): HTMLElement {
    return (
      (this.element.nativeElement.closest('jig-input-field') as HTMLElement | null) ??
      this.element.nativeElement
    );
  }

  /**
   * Characters that commit the typed text as a tag, in addition to Enter. Every
   * character is its own separator, so `',;'` splits on both. Newlines always
   * separate when text is pasted.
   * @default ''
   */
  public readonly delimiters = input<string>('');
  /**
   * Whether the same tag may be added more than once.
   * @default false
   */
  public readonly allowDuplicates = input(false, { transform: booleanAttribute });
  /**
   * The greatest number of tags allowed. At the limit the text field turns
   * readonly, so no further tag can be typed. See {@link rejected}.
   */
  public readonly maxTags = input(undefined, { transform: optionalNumberAttribute });
  /**
   * The fewest characters a tag may have. Shorter text is refused on commit and
   * stays in the field. See {@link rejected}.
   */
  public readonly minTagLength = input(undefined, { transform: optionalNumberAttribute });
  /**
   * The most characters a tag may have, applied as the field's `maxlength` so
   * longer text cannot be typed in the first place.
   */
  public readonly maxTagLength = input(undefined, { transform: optionalNumberAttribute });
  /**
   * Whether tags wrap onto several lines, growing the control's height. When
   * `false` they stay on one line and scroll horizontally.
   * @default false
   */
  public readonly multiline = input(false, { transform: booleanAttribute });
  /**
   * Whether typed text is trimmed before it becomes a tag.
   * @default true
   */
  public readonly trim = input(true, { transform: booleanAttribute });
  /**
   * Text shown in the field while nothing has been typed.
   */
  public readonly placeholder = input<string>();
  /**
   * Icon for a tag's remove button.
   */
  public readonly iconRemove = input<IconType>();
  /**
   * Suggestions offered while typing: a static list of strings or items, or a
   * callback receiving the typed text and the tags already added. The callback
   * may be async. Tags already added are always removed from the result.
   */
  public readonly suggestions = input<TagSuggestions>();
  /**
   * Milliseconds to wait after the last keystroke before asking a
   * {@link suggestions} callback again.
   * @default 200
   */
  public readonly suggestionsDebounce = input(200, { transform: numberAttribute });
  /**
   * Options for the suggestion dropdown's popover. Defaults to matching the
   * field's width.
   * @default { sizeConstraints: { width: 1, maxWidth: 1 } }
   */
  public readonly dropdownOptions = input<PopoverOptions>({
    sizeConstraints: { width: 1, maxWidth: 1 },
  });

  /**
   * Emitted when typed text was refused, with the reason why. The text stays in
   * the field so the user can correct it.
   */
  public readonly rejected = output<TagRejection>();

  /**
   * The tags held by the control, or `null` when there are none — never an empty
   * array, so signal-forms `required` reacts to an empty tag input.
   */
  public override readonly value = model<string[] | null>(null);

  /** The text typed but not yet committed. */
  public readonly pendingText = signal('');

  /**
   * What was last announced, resolved to a message by {@link announcement}. The
   * `seq` makes a repeat of the same event a distinct message, so rejecting the
   * same tag twice is announced twice.
   */
  private readonly _announced = signal<{
    kind: AnnouncementKind;
    tag: string;
    seq: number;
  } | null>(null);
  private _announceSeq = 0;

  /**
   * The live-region message. Derived rather than stored, so it re-resolves if the
   * translations land after the event that triggered it.
   */
  protected readonly announcement = computed(() => {
    const announced = this._announced();
    if (!announced) {
      return '';
    }
    const message = this.announcementFor(announced.kind, announced.tag);
    // Alternate a trailing no-break space: same wording, different node value, so a
    // repeated event re-announces instead of the region seeing an unchanged string.
    return message + '\u00A0'.repeat(announced.seq % 2);
  });

  private announcementFor(kind: AnnouncementKind, tag: string): string {
    switch (kind) {
      case 'added':
        return this.i18n['tagInput_added']({ tag });
      case 'removed':
        return this.i18n['tagInput_removed']({ tag });
      case 'duplicate':
        return this.i18n['tagInput_duplicate']({ tag });
      case 'tooShort':
        return this.i18n['tagInput_tooShort']({ min: this.minTagLength() });
      case 'tooLong':
        return this.i18n['tagInput_tooLong']({ max: this.maxTagLength() });
      case 'maxTags':
        return this.i18n['tagInput_maxTags']({ max: this.maxTags() });
    }
  }

  private _announce(kind: AnnouncementKind, tag: string): void {
    this._announced.set({ kind, tag, seq: ++this._announceSeq });
  }

  /** The current tags, with `null` flattened to an empty list for rendering. */
  protected readonly tags = computed(() => this.value() ?? []);

  /** Whether the tag limit has been reached. */
  public readonly full = computed(() => {
    const max = this.maxTags();
    return max !== undefined && this.tags().length >= max;
  });

  public override readonly empty = computed(
    () => this.tags().length === 0 && this.pendingText() === ''
  );

  private readonly _focused = signal(false);
  /**
   * Whether the user dismissed the suggestions with Escape. Cleared on blur, so
   * the list stays shut for the rest of this visit and returns on the next one.
   */
  private readonly _dismissed = signal(false);
  private readonly _debouncedText = debounceSignal(this.pendingText, () =>
    this.suggestionsDebounce()
  );

  /**
   * The suggestion set as offered, before the current tags are subtracted. A
   * callback is invoked with the debounced text; a static list resolves as-is and
   * is filtered by the list box instead.
   */
  private readonly _offeredSuggestions = asyncComputed<TagSuggestionsResult>(async () => {
    const suggestions = this.suggestions();
    if (!suggestions) {
      return [];
    }
    if (typeof suggestions !== 'function') {
      return suggestions;
    }
    return await suggestions(this._debouncedText(), this.tags());
  }, []);

  /**
   * Suggestions to render: the offered set as items, minus the tags already added,
   * and — for a static list — narrowed to the typed text. A callback does its own
   * narrowing, since it already receives the text. Filtering here rather than in
   * the list box keeps {@link suggestionsOpen} honest about what is on screen.
   */
  public readonly resolvedSuggestions = computed<JigItem<unknown, string>[]>(() => {
    const current = new Set(this.tags());
    const items = this._offeredSuggestions()
      .map(entry => (typeof entry === 'string' ? { label: entry, value: entry } : entry))
      .filter(item => !current.has(item.value));

    if (typeof this.suggestions() === 'function') {
      return items;
    }
    const text = this.pendingText().trim().toLowerCase();
    if (!text) {
      return items;
    }
    return items.filter(item => maybeCallback(item.label).toLowerCase().includes(text));
  });

  /** Whether a {@link suggestions} callback is in flight; drives the dropdown's spinner. */
  protected readonly suggestionsLoading = this._offeredSuggestions.isRunning;

  /**
   * Whether the suggestion dropdown should be open: only while focused, and only
   * with something to show — a pending request (so the spinner is visible) or a
   * non-empty result.
   */
  protected readonly suggestionsOpen = computed(
    () =>
      this._focused() &&
      !this._dismissed() &&
      !this.disabled() &&
      !this.readonly() &&
      !!this.suggestions() &&
      (this._offeredSuggestions.isRunning() || this.resolvedSuggestions().length > 0)
  );

  /** The option id the suggestion highlight sits on, for `aria-activedescendant`. */
  protected readonly highlightedOptionId = computed(
    () => this._dropdown()?.highlightedOptionId() ?? null
  );

  constructor() {
    super();
    // The dropdown owns its open state; drive it from what the control derives.
    // Only on an actual change — calling hide() on an already-closing popover
    // restarts its exit and wedges the lifecycle.
    explicitEffect([this.suggestionsOpen], ([open]) => {
      const dropdown = this._dropdown();
      if (!dropdown || dropdown.open() === open) {
        return;
      }
      if (open) {
        dropdown.show();
      } else {
        dropdown.hide();
      }
    });
  }

  /**
   * Commits a suggestion as a tag. The list stays open so several can be picked
   * in a row; the one just added drops out of it.
   */
  public pickSuggestion(value: string): void {
    this.addTag(value);
  }

  /**
   * Turns `text` into a tag. Returns `false` when it was blank or refused; a
   * refusal also emits {@link rejected} and is announced.
   */
  public addTag(text: string): boolean {
    const candidate = this.trim() ? text.trim() : text;
    if (!candidate) {
      return false;
    }
    if (this.full()) {
      return this._reject(candidate, 'maxTags');
    }
    const min = this.minTagLength();
    if (min !== undefined && candidate.length < min) {
      return this._reject(candidate, 'tooShort');
    }
    // The field's `maxlength` stops typing past the limit, but a paste and a
    // suggestion both reach here without passing through it.
    const max = this.maxTagLength();
    if (max !== undefined && candidate.length > max) {
      return this._reject(candidate, 'tooLong');
    }
    if (!this.allowDuplicates() && this.tags().includes(candidate)) {
      return this._reject(candidate, 'duplicate');
    }
    this.value.set([...this.tags(), candidate]);
    this._setFieldText('');
    this._announce('added', candidate);
    return true;
  }

  /**
   * Removes the tag at `index`, writing `null` when it was the last one.
   */
  public removeTag(index: number): boolean {
    const tags = this.tags();
    const removed = tags[index];
    if (removed === undefined) {
      return false;
    }
    const next = tags.filter((_, i) => i !== index);
    this.value.set(next.length ? next : null);
    this._announce('removed', removed);
    return true;
  }

  public override clearValue(): boolean {
    this.value.set(null);
    this._setFieldText('');
    return true;
  }

  public override focusFromPointer(event: MouseEvent): boolean {
    if (this.disabled()) {
      return false;
    }
    // A tag's remove button stays in charge of its own click.
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('button, a[href], [tabindex]:not([tabindex="-1"])')) {
      return false;
    }
    this._inputElement()?.focus();
    return true;
  }

  /** Commits every delimiter-separated fragment of the pending text. */
  public commitPendingDelimited(): void {
    this._setFieldText(this._commitAll(this._split(this._currentText())));
  }

  protected removeTagFn(index: number): () => void {
    return () => this.removeTag(index);
  }

  protected onInput(value: string | null): void {
    // Only tracks the text. Delimiters are intercepted on keydown, so the bound
    // value is never rewritten while the user is still typing into it.
    this.pendingText.set(value ?? '');
  }

  protected onPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (this._split(pasted).length <= 1) {
      return;
    }
    event.preventDefault();
    const element = this._inputElement();
    const text = this._currentText();
    const start = element?.selectionStart ?? text.length;
    const end = element?.selectionEnd ?? text.length;
    const merged = text.slice(0, start) + pasted + text.slice(end);
    this._setFieldText(this._commitAll(this._split(merged)));
  }

  protected onFocus(): void {
    this._focused.set(true);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.suggestionsOpen()) {
      event.preventDefault();
      this._dropdown()?.clearHighlight();
      // Stays dismissed until focus leaves and comes back — the field keeps focus.
      this._dismissed.set(true);
      return;
    }
    if (NAVIGATION_KEYS.includes(event.key)) {
      this._dropdown()?.onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }
    // A delimiter commits instead of reaching the field, so it never lands in the text.
    if (event.key.length === 1 && this._separators().has(event.key)) {
      event.preventDefault();
      this.addTag(this._currentText());
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const highlighted = this._dropdown()?.highlightedValue();
      if (highlighted) {
        this.pickSuggestion(highlighted);
        return;
      }
      this.addTag(this._currentText());
      return;
    }
    if (event.key === 'Backspace' && this._currentText() === '' && this.tags().length) {
      event.preventDefault();
      this.removeTag(this.tags().length - 1);
      return;
    }
    if (event.key === 'ArrowLeft' && this._caretAtStart() && this.tags().length) {
      event.preventDefault();
      this._focusTag(this.tags().length - 1);
    }
  }

  protected onTagKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      const remaining = this.tags().length - 1;
      this.removeTag(index);
      if (!remaining) {
        this._inputElement()?.focus();
        return;
      }
      // The roving items re-register after the removal renders.
      afterNextRender(
        { write: () => this._focusTag(Math.min(index, remaining - 1)) },
        { injector: this._injector }
      );
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this._inputElement()?.focus();
    }
  }

  protected onBlur(): void {
    this._focused.set(false);
    this._dismissed.set(false);
    this.addTag(this._currentText());
    this.markTouched();
  }

  private _reject(text: string, reason: TagRejectionReason): false {
    this.rejected.emit({ text, reason });
    this._announce(reason, text);
    return false;
  }

  /** Every declared delimiter, plus newlines, which always separate. */
  private _separators(): Set<string> {
    return new Set([...Array.from(this.delimiters()), '\n', '\r']);
  }

  private _split(text: string): string[] {
    const separators = this._separators();
    const parts: string[] = [];
    let current = '';
    for (const char of text) {
      if (separators.has(char)) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current);
    return parts;
  }

  /** Commits every fragment but the last, returning what stays in the field. */
  private _commitAll(parts: string[]): string {
    const trailing = parts.at(-1) ?? '';
    const committable = parts.slice(0, -1);
    for (let i = 0; i < committable.length; i++) {
      if (this.full()) {
        // Out of room: hand back everything still uncommitted, joined by a separator
        // that actually separates — newlines always do, even with no delimiter declared.
        const rest = [...committable.slice(i), trailing];
        return rest.join(this.delimiters()[0] ?? '\n');
      }
      this.addTag(committable[i] ?? '');
    }
    return trailing;
  }

  private _inputElement(): HTMLInputElement | null {
    return this.element.nativeElement.querySelector('input');
  }

  /**
   * The text in the field right now. `JigInput` mirrors the DOM into its model
   * from an effect, so on a key event the model still holds the previous value —
   * the element is the only authoritative source.
   */
  private _currentText(): string {
    return this._inputElement()?.value ?? this.pendingText();
  }

  /**
   * Replaces the field's text. The element is written synchronously so the next
   * keystroke lands on the new text, and `JigInput`'s model with it so its
   * element-sync effect sees the two already agreeing and leaves them alone.
   */
  private _setFieldText(text: string): void {
    const element = this._inputElement();
    if (element) {
      element.value = text;
      // Let JigInput pick the new text up through its own input path rather than
      // writing its model too, which would race the element sync the other way.
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    this.pendingText.set(text);
  }

  private _caretAtStart(): boolean {
    const input = this._inputElement();
    return !!input && input.selectionStart === 0 && input.selectionEnd === 0;
  }

  private _focusTag(index: number): void {
    const group = this._rovingGroup();
    if (!group) {
      return;
    }
    group.setActive(index);
    // setActive on an unchanged index does not re-run the focus effect.
    group.items()[index]?.element.focus();
  }
}
