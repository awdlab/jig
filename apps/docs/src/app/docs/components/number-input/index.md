The Number Input directive (`ngnNumberInput`) turns a native `<input>` into a
locale-aware number field with a `number | null` value model. You type freely
while focused and the value commits on **blur** or **Enter**. Pair it with
`awd-input-field` for field chrome and `awd-spin-buttons` for
increment/decrement buttons.

### Spin buttons

Pair the input with `awd-spin-buttons` for clickable increment/decrement
controls. Inside an `awd-input-field` the buttons find the number input
automatically — no wiring needed. They are a pointer affordance only (removed
from the tab order and hidden from screen readers), press-and-hold to
auto-repeat, and disable at the `min`/`max` bounds.

The arrangement is chosen per instance:

- **Stacked** (default): `<awd-spin-buttons />` — up/down chevrons at the trailing edge.
- **Inline**: `<awd-spin-buttons kind="inline" />` — both buttons side by side.
- **Flanking**: one instance with `buttons="decrement"` and one with
  `buttons="increment"`, placed on either side of the input.

{{ demo: Demo_NumberInput_Base }}

### Validation

The number input participates in validation like any value control; here a
value outside the allowed range surfaces an error message.

{{ demo: Demo_NumberInput_Validation }}

See the **Spin Buttons API** tab for the full `NgnSpinButtons` reference.

### Locale formatting

The locale defaults to Angular's `LOCALE_ID` and can be overridden per input.
Parsing accepts the locale's decimal separator and ignores its grouping
separators. While blurred the value is displayed formatted via
`Intl.NumberFormat`; while focused you edit the raw, ungrouped form.

{{ demo: Demo_NumberInput_Locale }}

### Bounds and step precision

**↑/↓** steps by `step` and **Shift+↑/↓** by `bigStep` (default `step * 10`);
stepping never wraps and stops at the `min`/`max` bounds. On commit, unparseable
text reverts to the last value and out-of-range values are clamped. Results are
rounded to the operands' precision, so the `0.1` steps below never show float
drift.

{{ demo: Demo_NumberInput_Steps }}
