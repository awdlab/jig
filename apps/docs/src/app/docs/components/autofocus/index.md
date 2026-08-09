`ngnAutofocus` focuses its host element once, after the first browser render.

It exists because the native `autofocus` attribute only applies on initial page
load — it does nothing for an element that appears later, which is the common
case in an Angular app (a revealed form, a newly added row, a switched tab).

### Basic Usage

Put the attribute on any focusable element. The focus happens after the element
has actually rendered, so it also works for a control that is still applying its
own initialization classes.

{{ demo: Demo_Autofocus_Base }}

### Conditional Autofocus

Bind the input to turn it off without removing the directive. The focus is
**latched**: it fires once and never again, so re-rendering or re-showing the
element does not re-steal focus. Setting the input to `false` releases the latch
— flipping it back to `true` focuses again.

{{ demo: Demo_Autofocus_Conditional }}

### Server-side rendering

Focusing is deferred to `afterNextRender`, which never runs on the server, so
the directive is inert during SSR and hydration. See
[SSR & Hydration](/guides/ssr-hydration).

### Inside a dialog

Do **not** use `ngnAutofocus` on a control inside a closed `<awd-dialog>`. The
directive latches on the first render — which happens while the dialog is still
closed and its content not focusable — so the focus is spent and nothing is
focused when the dialog opens.

Use the native `autofocus` attribute on the projected element instead; the
browser applies it when the dialog is shown:

```html
<awd-dialog [(open)]="open">
  <awd-input-field [label]="'Name'">
    <input ngnInput autofocus />
  </awd-input-field>
</awd-dialog>
```

For a dialog that is already open on first render, neither mechanism fires.
Focus the field yourself once the dialog has been shown:

```ts
afterRenderEffect({
  read: () => {
    if (this.open()) {
      this.field()?.nativeElement.focus();
    }
  },
});
```
