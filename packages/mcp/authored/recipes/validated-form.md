---
title: Validated form
summary: A labelled, validated form built from jig-input-field wrapping form controls.
controls: input-field, input, select, checkbox, number-input, button, hint, message
---

# Validated form

Compose a form from `jig-input-field` wrappers around individual controls. The
field provides the label / hint / error chrome; the inner control owns the
value. Verify each control's exact inputs with `get_control` before wiring.

## Shape

- Wrap every control in `jig-input-field` for consistent label + validation UI.
- Bind values with the control's signal model (`[(value)]`) or reactive-forms.
- Show validation state through the field; use `jig-hint` for helper text and the
  field's error surface for messages.
- Submit with a `button[jigButton]`; drive `disabled` / `loading` from form state.

## Skeleton

```html
<form (submit)="save()">
  <jig-input-field label="Name">
    <input jigInput [(value)]="name" required />
  </jig-input-field>

  <jig-input-field label="Role">
    <jig-select [(value)]="role" [options]="roles" />
  </jig-input-field>

  <jig-input-field label="Seats">
    <input jigNumberInput [(value)]="seats" [min]="1" />
  </jig-input-field>

  <jig-checkbox [(value)]="agreed">I agree</jig-checkbox>

  <button jigButton [disabled]="!agreed()">Save</button>
</form>
```

## Notes

- Prefer signals for form state (`signal()` / `model()`); jig controls are
  signal-first.
- For grouped choices use `jig-radio-group` + `jig-radio` or `jig-select-button`.
- Render validation messages with the `[jigErrors]` directive inside the field —
  it reads the bound control's `errors`/`touched`/`dirty`. Controls implement signal forms'
  `FormValueControl`, so `[formField]` works directly; there is no
  `ControlValueAccessor`.
- See the `getting-started-usage` and control docs for exact input names.
