`jig-tag-input` holds a list of string tags the user types and confirms. `Enter` always commits;
further characters can be declared as `delimiters`. Like [`jig-select`](/components/select), it
is designed to sit inside a [`jig-input-field`](/components/input-field).

**The value is `null` while there are no tags — never an empty array.** That is deliberate: "no
tags" is not "an empty list", and it is the only shape signal-forms `required` reacts to.

### Basic usage

{{ demo: Demo_TagInput_Base }}

### Layout

Tags stay on one line by default; a row too long to fit is panned by dragging it. Set `multiline`
to let them wrap and grow the control instead.

{{ demo: Demo_TagInput_Multiline }}

### Delimiters

Every character in `delimiters` is its own separator — below it is comma, semicolon and space. A
delimiter never lands in the value, and newlines always separate when text is pasted, so pasting
`one,two` followed by a line break and `three` yields three tags.

{{ demo: Demo_TagInput_Delimiters }}

### Duplicates

Duplicates are refused by default and the text stays in the field so the user can change it. Try
adding `design` twice in each of these; `allowDuplicates` lets the second one through.

{{ demo: Demo_TagInput_Duplicates }}

### Limits

`maxTags` turns the field readonly once reached, so no further tag can be typed.

{{ demo: Demo_TagInput_MaxTags }}

`minTagLength` refuses shorter text on commit and leaves it in the field. `maxTagLength` becomes
the field's native `maxlength`, so over-long text cannot be typed at all — and text that reaches
the control another way, from a paste or a suggestion, is refused on commit.

{{ demo: Demo_TagInput_TagLength }}

### Suggestions

`suggestions` takes a static list or a callback. A static list is narrowed by the typed text for
you; a callback receives the text and the tags already added and does its own narrowing. Either
way the tags already added are removed from the result, and picking one keeps the list open so
several can be chosen in a row.

The list is shown while the field has focus. `Escape` dismisses it, and it returns the next time
the field is focused.

{{ demo: Demo_TagInput_SuggestionsStatic }}

A callback may be async. It is debounced by `suggestionsDebounce` (200ms by default, 300ms
below), a spinner shows in the suggestion list while it runs, and out-of-order answers are
discarded.

{{ demo: Demo_TagInput_SuggestionsAsync }}

### Templates

The tag template receives the tag, its index and a `remove` callback. Here recipients render with
an avatar built from the address.

{{ demo: Demo_TagInput_Templates }}

### Validation

Count and per-tag length are validated in the form, not by the control — the control only
enforces what it can while typing. Two validators ship with this entry point:

```ts
import { form, required } from '@angular/forms/signals';
import { tagCount, tagLength } from '@awdlab/jig/tag-input';

const model = signal<{ tags: string[] | null }>({ tags: null });
const labelForm = form(model, path => {
  required(path.tags); // fires because an empty tag input is null
  tagCount(path.tags, { min: 2, max: 4 });
  tagLength(path.tags, { min: 2, max: 12 });
});
```

Use `tagCount` rather than the stock `minLength` / `maxLength`: those are typed against
`{ length }`, so they are a **compile error** against a nullable tag array. `tagLength` guards
values that arrive from outside the control — a server response, or limits tightened after tags
were stored.

Messages come from the control's own translations, so neither validator needs a
`jigErrorsMessages` override.

{{ demo: Demo_TagInput_Validation }}

### Reacting to a refusal

Refusals are announced to assistive technology already. Wire `rejected` when sighted users should
see them too — this one raises a snackbar.

{{ demo: Demo_TagInput_Rejected }}

### States

{{ demo: Demo_TagInput_States }}
