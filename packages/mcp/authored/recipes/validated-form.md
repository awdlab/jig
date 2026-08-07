---
title: Validated form
summary: A labelled, validated form built from ngn-input-field wrapping form controls.
controls: input-field, input, select, checkbox, number-input, button, hint, message
---

# Validated form

Compose a form from `ngn-input-field` wrappers around individual controls. The
field provides the label / hint / error chrome; the inner control owns the
value. Verify each control's exact inputs with `get_control` before wiring.

## Shape

- Wrap every control in `ngn-input-field` for consistent label + validation UI.
- Bind values with the control's signal model (`[(value)]`) or reactive-forms.
- Show validation state through the field; use `ngn-hint` for helper text and the
  field's error surface for messages.
- Submit with a `button[ngnButton]`; drive `disabled` / `loading` from form state.

## Skeleton

```html
<form (submit)="save()">
  <ngn-input-field label="Name">
    <input ngnInput [(value)]="name" required />
  </ngn-input-field>

  <ngn-input-field label="Role">
    <ngn-select [(value)]="role" [options]="roles" />
  </ngn-input-field>

  <ngn-input-field label="Seats">
    <input ngnNumberInput [(value)]="seats" [min]="1" />
  </ngn-input-field>

  <ngn-checkbox [(value)]="agreed">I agree</ngn-checkbox>

  <button ngnButton [disabled]="!agreed()">Save</button>
</form>
```

## Notes

- Prefer signals for form state (`signal()` / `model()`); ngn controls are
  signal-first.
- For grouped choices use `ngn-radio-group` + `ngn-radio` or `ngn-select-button`.
- Render validation messages with the `[ngnErrors]` directive inside the field —
  it reads the bound control's `errors`/`touched`/`dirty`. Controls implement signal forms'
  `FormValueControl`, so `[formField]` works directly; there is no
  `ControlValueAccessor`.
- See the `getting-started-usage` and control docs for exact input names.
