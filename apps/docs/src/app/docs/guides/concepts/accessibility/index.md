Accessibility is built into the control, not bolted onto the theme. Roles,
keyboard interaction, focus management and live-region announcements are part
of a control's behaviour — so they survive a theme swap, and you cannot style
them away.

The target is **WCAG 2.2 level AA**.

### What the library gives you

- **Roles and ARIA** following the
  [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) for each
  pattern — combobox, listbox, grid, dialog, tablist, tree, menu, and so on.
- **Keyboard interaction** for every interactive control. Each control page has
  an **A11y** tab with its exact key map.
- **Roving tabindex** for composite widgets, so a toolbar, tab list or radio
  group is one tab stop rather than many. See
  [Roving Focus](/components/roving-focus).
- **Focus trapping and restoration** in modal surfaces — a dialog traps focus
  while open and returns it to the trigger on close.
- **Live regions** for transient messages: toasts and snackbars render into a
  labelled region so they are announced without stealing focus.
- **Animation control** — all motion is CSS from the theme, collapses to
  near-zero automatically under `prefers-reduced-motion: reduce`, and can be
  turned off globally with one config flag. See
  [Animations](/guides/animations).
- **Localized ARIA strings** — every built-in `aria-label` comes from the
  translation table, so it follows the user's language. See
  [i18n](/guides/i18n).

Every control page's **A11y** tab documents that control's roles, keys, and —
importantly — what remains **your** responsibility.

### What is yours

A component library cannot make an application accessible. These stay with you:

**Names.** Most controls need a label you provide: `<jig-input-field [label]>`,
an `aria-label`, or `labelledBy`. A control with no accessible name is a
failure of [4.1.2](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
no matter how correct its role is.

**Descriptions.** Nothing wires `aria-describedby` for you. Point a field at
its hint's `controlId` so help text and validation messages are announced with
the field — see [Errors](/components/errors).

**Error announcement.** Hints swap text without a live region. That is right
for a message that appears on blur, and wrong for one that appears on submit or
arrives from a server — announce those yourself.

**Colour contrast.** The shipped themes aim for AA on their default palettes,
but you can configure any colour. Check your own palette, including muted and
disabled text, in both schemes. See [Colors](/guides/colors).

**Structure.** Headings, landmarks, page titles, focus order across the page,
and skip links are application concerns.

**Meaning.** No control can know that your icon-only button means "archive".

### Focus

Controls never steal focus on mount. Roving groups assign the tab stop without
focusing, and controls that move focus do so only in response to the user.

When you need to move focus yourself — into a dialog, onto the first invalid
field — do it after the element exists and is displayed:

```ts
afterRenderEffect({
  read: () => {
    if (this.open()) {
      this.field()?.nativeElement.focus();
    }
  },
});
```

[`jigAutofocus`](/components/autofocus) covers the simple case (an element that
appears in response to a user action), but it latches on first render — which
is why it is the wrong tool inside a dialog that starts closed. Use the native
`autofocus` attribute there.

### Keyboard-only paths

A few features are pointer-only by nature: dragging, drag-to-scroll, and the
native resize grip. Under
[WCAG 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
each needs a single-pointer, non-drag alternative — and under
[2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) the outcome
must be reachable by keyboard. Keep them as conveniences layered over something
that already works.

### Testing it

An automated scan catches roughly a third of real issues. Run one, then use the
keyboard.

```ts
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .analyze();

expect(results.violations).toEqual([]);
```

Then, manually: Tab through the page and confirm the order matches the visual
order, every stop is visible, no stop is a dead end, and Escape gets you out of
anything modal. Then try it at 200% zoom and 400% for reflow.

This library's own suite runs axe with `wcag22aa` plus colour-contrast on every
control demo, so a regression in a control fails CI.

### Known gaps

Nothing is perfect, and pretending otherwise is not useful:

- **Muted text contrast** in some nova colour combinations sits below AA and is
  being tightened.
- **Virtualized lists and grids** expose `aria-setsize` / `aria-posinset`, but
  only the rendered window is in the DOM — screen-reader "read all" of a
  virtualized region is not equivalent to a fully rendered one. Prefer
  pagination where completeness matters more than length.

### Reference

- [Errors](/components/errors) — validation messages and announcements
- [Roving Focus](/components/roving-focus) — the composite-widget keyboard model
- [Forms & Validation](/guides/forms-validation) — labelling and invalid state
- Each control's **A11y** tab — the authoritative per-control detail
