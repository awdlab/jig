import type { JigItem } from '@awdlab/jig/api';

/**
 * A resolved set of suggestions: plain strings, or full items when the label
 * shown should differ from the tag committed.
 * @category types
 */
export type TagSuggestionsResult = readonly string[] | readonly JigItem<unknown, string>[];

/**
 * Suggestions offered while typing: a static list, or a callback receiving the
 * currently typed text and the tags already added. The callback may be async.
 * @category types
 */
export type TagSuggestions =
  | TagSuggestionsResult
  | ((
      text: string,
      tags: readonly string[]
    ) => TagSuggestionsResult | Promise<TagSuggestionsResult>);

/**
 * Why a tag input refused to turn typed text into a tag.
 * @category types
 */
export type TagRejectionReason = 'duplicate' | 'tooShort' | 'maxTags';

/**
 * A refused tag, carried by the tag input's `rejected` output.
 * @category types
 */
export interface TagRejection {
  /** The text that was refused. It stays in the field so the user can fix it. */
  text: string;
  /** Which rule refused it. */
  reason: TagRejectionReason;
}
