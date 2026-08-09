---
title: Validated form
summary: A labelled, validated form built from awd-input-field wrapping form controls.
controls: input-field, input, select, checkbox, number-input, button, hint, message
---

# Validated form

Compose a form from `awd-input-field` wrappers around individual controls. The
field provides the label / hint / error chrome; the inner control owns the
value. Verify each control's exact inputs with `get_control` before wiring.

## Shape

- Wrap every control in `awd-input-field` for consistent label + validation UI.
- Bind values with the control's signal model (`[(value)]`) or reactive-forms.
- Show validation state through the field; use `awd-hint` for helper text and the
  field's error surface for messages.
- Submit with a `button[ngnButton]`; drive `disabled` / `loading` from form state.

## Skeleton

```html
<form (submit)="save()">
  <awd-input-field label="Name">
    <input ngnInput [(value)]="name" required />
  </awd-input-field>

  <awd-input-field label="Role">
    <awd-select [(value)]="role" [options]="roles" />
  </awd-input-field>

  <awd-input-field label="Seats">
    <input ngnNumberInput [(value)]="seats" [min]="1" />
  </awd-input-field>

  <awd-checkbox [(value)]="agreed">I agree</awd-checkbox>

  <button ngnButton [disabled]="!agreed()">Save</button>
</form>
```

## Notes

- Prefer signals for form state (`signal()` / `model()`); awd controls are
  signal-first.
- For grouped choices use `awd-radio-group` + `awd-radio` or `awd-select-button`.
- Render validation messages with the `[ngnErrors]` directive inside the field —
  it reads the bound control's `errors`/`touched`/`dirty`. Controls implement signal forms'
  `FormValueControl`, so `[formField]` works directly; there is no
  `ControlValueAccessor`.
- See the `getting-started-usage` and control docs for exact input names.
