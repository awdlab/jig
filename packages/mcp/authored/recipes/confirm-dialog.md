---
title: Confirm / edit dialog flow
summary: A declarative dialog opened from a button, with confirm and cancel actions.
controls: dialog, button, input-field, input, snackbar, toast
---

# Confirm / edit dialog flow

`ngn-dialog` is declarative: drive it from an `open` signal via `[(open)]`, not a
service call. Open it from a trigger, edit inside, confirm/cancel to close, then
surface the outcome with `ngn-snackbar` or `ngn-toast`.

## Shape

- Keep dialog visibility in a `signal(false)` bound with `[(open)]`.
- Put form controls inside the dialog (wrapped in `ngn-input-field`).
- Confirm action validates, applies, closes (`open.set(false)`), and notifies.
- Cancel just closes.

## Skeleton

```html
<button ngnButton (click)="open.set(true)">Edit</button>

<ngn-dialog [(open)]="open" [modal]="true">
  <ngn-input-field label="Title">
    <input ngnInput [(value)]="draft" />
  </ngn-input-field>

  <button ngnButton (click)="open.set(false)">Cancel</button>
  <button ngnButton (click)="confirm()">Save</button>
</ngn-dialog>
```

```ts
readonly open = signal(false);
readonly draft = signal('');

confirm() {
  this.apply(this.draft());
  this.open.set(false);
  this.snackbar.show('Saved');   // verify snackbar/toast API with get_control
}
```

## Notes

- For destructive confirms, keep the dialog minimal (message + Confirm/Cancel).
- Verify the dialog's header/footer projection and `iconClose` input with
  `get_control`.
