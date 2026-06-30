import { MASKS } from './masks';
import { DATE_TIME_MASKS } from './masks-date-time';

import type { EnumField, Field, InputMaskCfg, NumberField, Part } from './types';

export type RenderToken =
  | { kind: 'sep'; text: string }
  | { kind: 'section'; ord: number; text: string; placeholder: boolean };

export function resolveMask(input: InputMaskCfg | string | null): Part[] | null {
  if (!input) return null;
  const cfg: InputMaskCfg | undefined =
    typeof input === 'string'
      ? ((MASKS as Record<string, InputMaskCfg>)[input] ??
        (DATE_TIME_MASKS as Record<string, InputMaskCfg>)[input])
      : input;
  if (!cfg) return null; // unknown raw string → unsupported

  return cfg.map<Part>(item => {
    if (typeof item === 'string') return { kind: 'sep', text: item };
    if (item.kind === 'number') {
      const maxLen = item.length ?? String(item.max).length;
      const field: NumberField = {
        kind: 'number',
        name: item.segment,
        min: item.min,
        max: item.max,
        maxLen,
        pad: item.length != null,
        placeholder: item.placeholder ?? '-'.repeat(maxLen),
      };
      return field;
    }
    // Guard an empty values array: Math.max(...[]) is -Infinity, which would
    // throw in '-'.repeat(maxLen). An empty enum is degenerate but must not crash.
    const maxLen = item.values.length === 0 ? 0 : Math.max(...item.values.map(v => v.length));
    const field: EnumField = {
      kind: 'enum',
      name: item.segment,
      values: [...item.values],
      maxLen,
      placeholder: item.placeholder ?? (maxLen > 0 ? '-'.repeat(maxLen) : ''),
    };
    return field;
  });
}

export function fieldList(parts: Part[]): Field[] {
  return parts.filter((p): p is Field => p.kind !== 'sep');
}

/**
 * Index of the section whose horizontal box is nearest `clientX`.
 * - `clientX` left of the first section → 0
 * - `clientX` right of the last section → last index
 * - inside a section → that section
 * - in a gap/separator between two sections → the nearer one
 * Returns -1 for an empty list.
 */
export function nearestSectionIndex(
  rects: readonly { left: number; right: number }[],
  clientX: number
): number {
  if (rects.length === 0) return -1;
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (!r) continue;
    const dist = clientX < r.left ? r.left - clientX : clientX > r.right ? clientX - r.right : 0;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
    if (dist === 0) break; // inside a section — exact hit
  }
  return best;
}

/**
 * Enforce the no-gaps invariant: scanning from index 0, once the first empty
 * field is seen, blank every field after it. A delete that empties an earlier
 * field therefore clears the now-orphaned later fields too.
 */
export function truncateGaps(values: string[]): string[] {
  let seenEmpty = false;
  return values.map(v => {
    if (seenEmpty) return '';
    if (!v) {
      seenEmpty = true;
      return '';
    }
    return v;
  });
}

// ---- New per-section pure functions ----

/**
 * Type a char into ONE section. Returns the new section value + whether focus
 * should auto-advance to the next section, or null if the char is rejected.
 *
 * For number fields:
 * - Non-digit → null.
 * - If current is already complete (length===maxLen or value*10>max) a digit
 *   starts a fresh value (replace).
 * - Otherwise appending is attempted. If the appended candidate exceeds max or
 *   maxLen, restart with the bare digit instead.
 * - advance:true when the resulting value is isSectionComplete.
 *
 * For enum fields:
 * - Match by case-insensitive first char; on match returns {value, advance:true}.
 * - No match → null.
 *
 * NOTE: padding is NOT applied to the returned value — that is a display concern.
 */
export function typeIntoSection(
  field: Field,
  current: string,
  ch: string
): { value: string; advance: boolean } | null {
  if (field.kind === 'enum') {
    const match = field.values.find(val => val[0]?.toLowerCase() === ch.toLowerCase());
    if (!match) return null;
    return { value: match, advance: true };
  }

  // number field — a single digit only (multi-char data is rejected outright).
  if (!/^\d$/.test(ch)) return null;

  // If current section is already complete, start fresh
  const currentComplete = current !== '' && isSectionComplete(field, current);
  let candidate: string;
  if (currentComplete) {
    candidate = ch;
  } else {
    const appended = current + ch;
    // If appending would exceed max or length, restart with bare digit
    if (appended.length > field.maxLen || Number(appended) > field.max) {
      // A single digit that is itself out of range can never be a valid value
      // for this field (only possible for tiny fields with max < 10) → reject.
      if (Number(ch) > field.max) return null;
      candidate = ch;
    } else {
      candidate = appended;
    }
  }

  // A full-width candidate below the field minimum (e.g. '00' for a day/month
  // whose min is 1) is invalid — reject rather than letting it "complete".
  if (candidate.length === field.maxLen && Number(candidate) < field.min) return null;

  const advance = isSectionComplete(field, candidate);
  return { value: candidate, advance };
}

/**
 * Step/cycle a section value up (1) or down (-1). Empty defaults sensibly.
 *
 * For number fields:
 * - empty → field.min (no extra dir step on the empty→min transition).
 * - Non-empty: n = Number(current) + dir, wrap at >max → min, <min → max.
 * - Returns padded (padStart maxLen '0') iff field.pad.
 *
 * For enum fields:
 * - Find current (case-insensitive) in values; step by dir with wraparound.
 * - empty/not-found → first value (dir:1) or last value (dir:-1).
 */
export function stepSection(field: Field, current: string, dir: 1 | -1): string {
  if (field.kind === 'enum') {
    const i = field.values.findIndex(v => v.toLowerCase() === current.toLowerCase());
    if (i === -1) {
      return (dir === 1 ? field.values[0] : field.values[field.values.length - 1]) ?? '';
    }
    const next = (i + dir + field.values.length) % field.values.length;
    return field.values[next] ?? field.values[0] ?? '';
  }

  // number field
  if (current === '') {
    const min = field.min;
    return field.pad ? String(min).padStart(field.maxLen, '0') : String(min);
  }

  let n = Number(current) + dir;
  if (n > field.max) n = field.min;
  if (n < field.min) n = field.max;
  return field.pad ? String(n).padStart(field.maxLen, '0') : String(n);
}

/**
 * Whether a single section value is "done" (would auto-advance or is a fully
 * matched enum). Empty → always false.
 *
 * number: value.length===maxLen OR Number(value)*10 > max.
 * enum: value is literally in the values list (case-sensitive).
 */
export function isSectionComplete(field: Field, value: string): boolean {
  if (value === '') return false;
  if (field.kind === 'enum') return field.values.includes(value);
  if (!/^\d+$/.test(value)) return false;
  const n = Number(value);
  // A complete number value must be within range AND either fill the width or be
  // unable to grow further (value*10 would exceed max).
  return n >= field.min && n <= field.max && (value.length === field.maxLen || n * 10 > field.max);
}

/**
 * Whether all fields in the mask have a complete value.
 * Empty field list → false.
 */
export function isComplete(parts: Part[], values: string[]): boolean {
  const fields = fieldList(parts);
  if (fields.length === 0) return false;
  return fields.every((field, i) => isSectionComplete(field, values[i] ?? ''));
}

/**
 * Render each part as a RenderToken for display. No offsets.
 *
 * Separator → {kind:'sep', text}.
 * Field → {kind:'section', ord, text, placeholder}:
 *   - empty value → text=field.placeholder, placeholder=true
 *   - filled → text=padded(number&&pad) or raw value, placeholder=false
 *
 * `ord` is the 0-based field ordinal (index among fields, not among all parts).
 *
 * When `activeOrd` is provided, a padded number field that is currently active
 * AND not yet complete renders its raw typed digits instead of zero-padded text.
 * This matches native date-field behaviour: padding is deferred until the section
 * is committed (complete or navigated away from).
 * When `activeOrd` is omitted, all non-empty padded fields are padded (preserving
 * the "fully padded" output for callers that don't track the active section).
 */
export function composeDisplay(parts: Part[], values: string[], activeOrd?: number): RenderToken[] {
  const tokens: RenderToken[] = [];
  let fieldOrd = 0;
  for (const part of parts) {
    if (part.kind === 'sep') {
      tokens.push({ kind: 'sep', text: part.text });
    } else {
      const o = fieldOrd;
      const value = values[o] ?? '';
      if (value === '') {
        tokens.push({ kind: 'section', ord: o, text: part.placeholder, placeholder: true });
      } else {
        const padded =
          part.kind === 'number' && part.pad && (o !== activeOrd || isSectionComplete(part, value));
        const text = padded ? value.padStart(part.maxLen, '0') : value;
        tokens.push({ kind: 'section', ord: o, text, placeholder: false });
      }
      fieldOrd++;
    }
  }
  return tokens;
}

/**
 * Compose the full serialized output string (padded per field definition).
 * Separators are appended verbatim. Number fields are padded iff field.pad.
 * Enum fields are verbatim. Empty values are included as-is (empty string).
 */
export function serialize(parts: Part[], values: string[]): string {
  let result = '';
  let fieldOrd = 0;
  for (const part of parts) {
    if (part.kind === 'sep') {
      result += part.text;
    } else {
      const value = values[fieldOrd] ?? '';
      if (part.kind === 'number' && part.pad) {
        result += value.padStart(part.maxLen, '0');
      } else {
        result += value;
      }
      fieldOrd++;
    }
  }
  return result;
}

// ---- Kept internals ----

/**
 * Separator-aware string parser shared by `paste` and `deserialize`. Walks the
 * parts left→right with a cursor into `str`:
 * - **separator**: consume `sep.text` if present at the cursor; separators are
 *   optional (so a no-separator paste like `'1234'` still works).
 * - **number field**: consume the maximal run of digits, capped at `maxLen`
 *   (naturally stops at a non-digit such as a separator). Zero digits → leave
 *   the field empty and stop. A chunk outside `[min,max]` → invalid.
 * - **enum field**: match a value (exact case-insensitive, else first char);
 *   no match with chars remaining → invalid; no chars remaining → stop.
 *
 * The result is run through `truncateGaps` so a skipped middle field never
 * leaves a gap. `ok` is false when a field was outright invalid (out of range /
 * unmatched), in which case `values` holds the valid prefix parsed so far.
 */
/** Per-field parse outcome: `stop` = nothing left to consume (partial input). */
type FieldParse = { value: string; cursor: number; ok: boolean; stop: boolean };

/** Consume the maximal in-range digit run for a number field at `cursor`. */
function takeNumberField(field: NumberField, str: string, cursor: number): FieldParse {
  let take = '';
  while (take.length < field.maxLen) {
    const c = str[cursor] ?? '';
    if (!/\d/.test(c)) break;
    take += c;
    cursor++;
  }
  if (take === '') return { value: '', cursor, ok: true, stop: true };
  const n = Number(take);
  if (n < field.min || n > field.max) return { value: '', cursor, ok: false, stop: false };
  return { value: take, cursor, ok: true, stop: false };
}

/** Match an enum value (exact case-insensitive, else first char) at `cursor`. */
function takeEnumField(field: EnumField, str: string, cursor: number): FieldParse {
  const rest = str.slice(cursor);
  if (rest === '') return { value: '', cursor, ok: true, stop: true };
  const exact = field.values.find(v => v.toUpperCase() === rest.slice(0, v.length).toUpperCase());
  const match = exact ?? field.values.find(v => v[0]?.toUpperCase() === rest[0]?.toUpperCase());
  if (!match) return { value: '', cursor, ok: false, stop: false };
  return { value: match, cursor: cursor + match.length, ok: true, stop: false };
}

function feedString(parts: Part[], str: string): { values: string[]; ok: boolean } {
  const fields = fieldList(parts);
  const values = fields.map(() => '');
  let cursor = 0;
  let o = 0; // field ordinal
  let ok = true;

  for (const part of parts) {
    if (part.kind === 'sep') {
      if (str.startsWith(part.text, cursor)) cursor += part.text.length;
      continue;
    }
    const res =
      part.kind === 'number'
        ? takeNumberField(part, str, cursor)
        : takeEnumField(part, str, cursor);
    if (!res.ok) {
      ok = false;
      break;
    }
    if (res.stop) break; // partial input — leave this and the rest empty
    values[o] = res.value;
    cursor = res.cursor;
    o++;
  }

  // Any unconsumed trailing input means the string didn't fully match the mask.
  // `paste` treats this as invalid (returns null); `deserialize` ignores `ok`
  // and keeps the best-effort prefix.
  if (cursor < str.length) ok = false;
  return { values: truncateGaps(values), ok };
}

export function paste(parts: Part[], text: string): { values: string[]; offset: number } | null {
  const { values, ok } = feedString(parts, text);
  if (!ok) return null; // any invalid field rejects the whole paste
  // offset: count the committed characters in a simple left-to-right walk
  let offset = 0;
  let fieldOrd = 0;
  for (const part of parts) {
    if (part.kind === 'sep') {
      // include separator only if the next field has a value
      const nextValue = values[fieldOrd] ?? '';
      if (nextValue) offset += part.text.length;
    } else {
      const v = values[fieldOrd] ?? '';
      if (v) offset += v.length;
      fieldOrd++;
    }
  }
  return { values, offset };
}

export function deserialize(parts: Part[], str: string): string[] {
  // Best-effort separator-aware parse. On an invalid/out-of-range field we keep
  // the valid prefix (feedString already stopped there, leaving the rest empty)
  // rather than producing garbage. Never throws.
  return feedString(parts, str).values;
}
