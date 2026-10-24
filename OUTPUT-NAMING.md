# Output naming — the conventions in use, and the one to keep

Written as part of the deep review (see [REVIEW.md](REVIEW.md), finding B5). This
is a proposal: nothing here has been applied.

## What is in the code today

36 outputs across the library, spread over six conventions.

| Convention                              | Outputs                                                                                                                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Past participle** — it happened       | `clicked`, `closed`, `completed`, `rejected`, `dragged`, `daySelected`, `monthSelected`, `yearSelected`, `buttonClicked`, `itemClicked`, `commandSelected`, `endReached` |
| **Present participle** — it is about to | `closing`                                                                                                                                                                |
| **`*Change`** — state moved             | `filterChange`, `filterResultChange`, `activeItemChange`, `timeChange`                                                                                                   |
| **Bare imperative verb**                | `upload`, `remove`, `retry`, `cancelUpload`, `closeSnackbar`, `closeToast`, `closeAll`, `nextMonth`, `previousMonth`                                                     |
| **Noun phrase**                         | `valueCommit`, `promptResult`, `nodeExpand`, `touch`, `dragStart`, `dragEnd`, `stateSaving`, `stateLoading`                                                              |
| **Plain noun**                          | `value` (paginator)                                                                                                                                                      |

Plus 23 `model()`s, each of which emits a `*Change` output for free (`openChange`,
`valueChange`, `sortChange`, …). That makes `*Change` already the single most
common suffix in the library — it just isn't a rule yet.

Three cases are actively misleading rather than merely inconsistent:

- **`JigUpload.upload` / `.remove` / `.retry`** read as methods you call. In a
  template, `(upload)="upload($event)"` is ambiguous at a glance.
  `JigUpload` also has real methods — `uploadFile`, `uploadAll`, `markDone` — so
  the two are genuinely confusable.
- **`closeSnackbar` / `closeToast`** restate the control's own name and are
  imperative, where every other overlay uses `closed`.
- **`JigPaginator.value`** is an `OutputEmitterRef<PaginationState>`. In Angular,
  `value` reads as half of a `value`/`valueChange` two-way pair, and
  `ValueControlBase.value` is a `model` on every other control. The paginator
  also has a `page` model, so `value` and `pageChange` both fire on the same
  interaction.

## The rule

Three categories, in priority order. The first that applies wins.

### 1. `*Change` — a piece of state moved

Pair it with a `model()` wherever the consumer could reasonably want to write it
back. Angular gives you `xChange` from `model x` for free, so this is the default
for anything two-way-able.

> `openChange`, `valueChange`, `sortChange`, `filterTextChange`, `activeTabChange`

### 2. Past participle — something happened, and it is done

For events with no state to write back: a click, a dismissal, a completed
animation. Name them `{subject}{Verb}ed`, subject first, and drop the subject
when it is the control itself.

> `closed`, `clicked`, `itemClicked`, `daySelected`, `fileRemoved`

### 3. Present participle — something is starting, and you can still react

Reserved for the "before" half of a bracketed pair, where the consumer gets a
chance to act while it is in flight.

> `closing` (paired with `closed`), `dragStart`/`dragEnd` → `dragStarted`/`dragEnded`

**Never** a bare imperative verb, and never a bare noun. An output is a thing
that happened, not a command and not a value.

## The renames this implies

| Control            | Now                   | Proposed                  | Why                                                             |
| ------------------ | --------------------- | ------------------------- | --------------------------------------------------------------- |
| `jig-upload`       | `upload`              | `uploadRequested`         | Reads as a method; collides with `uploadFile`.                  |
| `jig-upload`       | `remove`              | `fileRemoved`             | Same.                                                           |
| `jig-upload`       | `retry`               | `retryRequested`          | Same.                                                           |
| `jig-upload`       | `cancelUpload`        | `uploadCancelled`         | Same.                                                           |
| `jig-snackbar`     | `closeSnackbar`       | `closed`                  | Matches every other overlay.                                    |
| `jig-toast`        | `closeToast`          | `closed`                  | Same.                                                           |
| `jig-menu`         | `closeAll`            | `allClosed`               | Imperative.                                                     |
| `jig-paginator`    | `value`               | `stateChange`             | `value` means the two-way pair.                                 |
| `jig-slider`       | `valueCommit`         | `valueCommitted`          | Noun phrase.                                                    |
| `jig-tree`         | `nodeExpand`          | `nodeExpanded`            | Noun phrase.                                                    |
| `jig-calendar`     | `nextMonth`           | `nextMonthRequested`      | Imperative. (Internal — see below.)                             |
| `jig-calendar`     | `previousMonth`       | `previousMonthRequested`  | Same.                                                           |
| `jig-calendar`     | `timeChanged`         | `timeChange`              | State moved; also the sibling is `timeChange`.                  |
| `jig-splitter`     | `stateSaving`         | `stateSaving`             | Keep — it is the "before" half, category 3.                     |
| `jig-splitter`     | `stateLoading`        | `stateLoading`            | Keep.                                                           |
| `JigDrag`          | `dragStart`/`dragEnd` | `dragStarted`/`dragEnded` | Category 3.                                                     |
| `JigScrollAmount`  | `endReached`          | `endReached`              | Keep — already a past participle.                               |
| `ValueControlBase` | `touch`               | `touch`                   | Keep — it is Angular's `FormUiControl` contract name, not ours. |

`promptResult` stays: it carries a result, and `promptResolved` would lose that.

## How to do it

1. Land the renames in one commit — alpha, no deprecation window, and a split
   migration is worse than a single breaking one.
2. Add the rule to `AGENTS.md` under **Input / output properties**, next to the
   existing icon-prefix and boolean-transform rules, so new controls follow it
   without being told.
3. The renames touch demos, docs pages, Playwright tests and the test-wrapper
   registry. `JigUpload` and `jig-paginator` are the only ones with more than a
   handful of call sites.
