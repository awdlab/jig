The Number Input directive (`ngnNumberInput`) turns a native `<input>` into a
locale-aware number input with a `number | null` value model. Use it together
with `ngn-input-field` for field chrome and `ngn-spin-buttons` for
increment/decrement buttons.

You can type freely while the input is focused; the value is committed on
**blur** or **Enter** — unparseable text reverts to the last value,
out-of-range values are clamped to `min`/`max`. While blurred the value is
displayed formatted via `Intl.NumberFormat` (grouping separators etc.); while
focused you edit the raw, ungrouped form.

**↑/↓** steps by `step`, **Shift+↑/↓** by `bigStep` (default `step * 10`).
Stepping never wraps and stops at the bounds; results are rounded to the
operands' precision, so `0.1`-steps never show float drift. The input carries
the `spinbutton` role with `aria-valuenow`/`-valuemin`/`-valuemax`.

### Spin buttons

Pair the input with `ngn-spin-buttons` for clickable increment/decrement
controls. Inside an `ngn-input-field` the buttons find the number input
automatically — no wiring needed. They are a pointer affordance only (removed
from the tab order and hidden from screen readers), press-and-hold to
auto-repeat, and disable at the `min`/`max` bounds.

The arrangement is chosen per instance:

- **Stacked** (default): `<ngn-spin-buttons />` — up/down chevrons at the trailing edge.
- **Inline**: `<ngn-spin-buttons kind="inline" />` — both buttons side by side.
- **Flanking**: one instance with `buttons="decrement"` and one with
  `buttons="increment"`, placed on either side of the input.

{{ demo: Demo_NumberInput_Base }}

### Validation

{{ demo: Demo_NumberInput_Validation }}

See the **Spin Buttons API** tab for the full `NgnSpinButtons` reference.

### Locale formatting

The locale defaults to Angular's `LOCALE_ID` and can be overridden per input.
Parsing accepts the locale's decimal separator and ignores its grouping
separators.

{{ demo: Demo_NumberInput_Locale }}

### Bounds and step precision

{{ demo: Demo_NumberInput_Steps }}
