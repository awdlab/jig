import type { Theme, ThemePart } from '@awdlab/jig-themes';

type KindMap = Record<string, readonly string[]>;

type Change<Known extends string> = {
  /** Values of the theme's list to drop. */
  readonly remove?: readonly Known[];
  /** Values to append after the surviving ones. */
  readonly add?: readonly string[];
};

// The [never] wrappers are required: a bare `never extends { … (infer T)[] }` matches with no
// inference candidate, which silently yields `unknown` and widens the whole list.
type RemovedOf<X> = [NonNullable<X>] extends [never]
  ? never
  : NonNullable<X> extends { readonly remove: readonly (infer R)[] }
    ? R
    : never;
type AddedOf<X> = [NonNullable<X>] extends [never]
  ? never
  : NonNullable<X> extends { readonly add: readonly (infer A)[] }
    ? A
    : never;
// Deliberately not exported: annotating a variable with it widens the literals away, which would
// silently decouple the returned types from the runtime list. Pass an inline literal.
type KindCustomization<K extends KindMap> = {
  readonly [N in keyof K]?: Change<K[N][number]>;
} & {
  readonly [control: string]: Change<string> | undefined;
};

export type CustomizedKinds<K extends KindMap, C> = {
  readonly [N in keyof C]: readonly (
    | (N extends keyof K ? Exclude<K[N][number], RemovedOf<C[N]>> : never)
    | AddedOf<C[N]>
  )[];
};

type ColorCustomization<CO extends readonly string[]> = Change<CO[number]>;

export type CustomizedColors<CO extends readonly string[], X> = readonly (
  | Exclude<CO[number], RemovedOf<X>>
  | AddedOf<X>
)[];

function applyChange(
  base: readonly string[],
  change: Change<string> | undefined
): readonly string[] {
  const removed = new Set(change?.remove ?? []);
  const kept = base.filter(value => !removed.has(value));
  return Object.freeze([...new Set([...kept, ...(change?.add ?? [])])]);
}

/**
 * Builds an app's kind lists from a theme's own, removing and adding per control. Feed the result
 * both to `JigCustomTypes` (as `typeof`) and to `provideJigControls`, so types and runtime agree.
 * Only the controls the customization names appear in the result, so every other control keeps
 * falling back to whichever theme is active. A control the theme does not define contributes its
 * `add` list alone.
 */
export function customizeKinds<const K extends KindMap, const C extends KindCustomization<K>>(
  theme: Theme<ThemePart[], K, readonly string[]>,
  customization: C
): CustomizedKinds<K, C> {
  const source: KindMap = theme.meta.kinds ?? {};
  const changes = customization as Record<string, Change<string> | undefined>;
  const result: Record<string, readonly string[]> = {};
  for (const control of Object.keys(changes)) {
    result[control] = applyChange(source[control] ?? [], changes[control]);
  }
  return Object.freeze(result) as CustomizedKinds<K, C>;
}

/**
 * Builds an app's color list from a theme's own. The color axis is global rather than per control,
 * so this takes a single {@link ColorCustomization}. See {@link customizeKinds}.
 */
export function customizeColors<
  const CO extends readonly string[],
  const X extends ColorCustomization<CO>,
>(theme: Theme<ThemePart[], KindMap, CO>, customization: X): CustomizedColors<CO, X> {
  return applyChange(theme.meta.colors ?? [], customization) as CustomizedColors<CO, X>;
}
