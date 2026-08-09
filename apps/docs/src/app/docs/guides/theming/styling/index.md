You have four ways to change how a control looks, in increasing order of reach.
Pick the smallest one that does the job.

| Want to change…                | Use                                                    |
| ------------------------------ | ------------------------------------------------------ |
| one instance, from the outside | a class or style on the host                           |
| one instance, deep inside      | [Passthrough](/guides/passthrough) (`pt`)              |
| every instance of one control  | replace that control's theme part                      |
| the whole look                 | tokens, or [your own theme](/guides/authoring-a-theme) |

### Why your CSS wins

All generated CSS is emitted inside a single cascade layer, `jig-controls` by
default. Unlayered CSS beats layered CSS **regardless of specificity**, so a
plain class selector of yours overrides the theme without `!important` and
without `::ng-deep`:

```css
/* wins over the theme's .jig-button rules */
.checkout-button {
  border-radius: 0;
}
```

This is the whole reason the layer exists. If you deliberately want the theme
to win over your CSS, put yours in an earlier layer, or set
`theme.cssLayer: null` in the [configuration](/guides/configuration) to emit
unlayered CSS and go back to ordinary specificity rules.

### Design tokens

Everything the themes draw with is a CSS custom property, so re-pointing a
token restyles everything that uses it — including your own components:

```css
:root {
  --jig-size-radius-md: 2px;
}

.dashboard {
  --jig-color-primary-500: #7c3aed;
}
```

Because they are ordinary custom properties, they cascade: scoping an override
to a subtree restyles only the controls inside it. See
[Colors](/guides/colors) for the palette and
[Theme Internals](/guides/theme-internals) for how token names are derived.

### Targeting generated classes

Class names follow `{prefix}{scope}-{part}` — `jig-button-root`,
`jig-select-popover-content`. They are stable, and the
[Playwright harnesses](/guides/testing) derive selectors from the same
templates, so they are safe to target.

Even so, prefer `pt` for anything inside a control: it is typed against that
control's scopes, so a renamed part is a compile error rather than CSS that
silently stops applying.

### Turning styling off

`unstyled` drops the themed layer for a control while keeping the structural
base rules — layout and positioning stay, colours and decoration go:

```html
<jig-select unstyled class="my-own-select" />
```

It cascades to nested controls, so an unstyled composite does not have styled
children. Use it when you want to build a control's look from scratch without
fighting the theme.

### Tailwind

Tailwind is not required, and nothing in the library depends on it. Where you
do use it, the interaction is the same as any other CSS of yours: Tailwind
utilities are unlayered by default and therefore win over the theme.

Utilities on a control's host work as expected:

```html
<button jigButton class="w-full sm:w-auto">Save</button>
```

For anything inside, go through `pt` — it accepts class strings, so Tailwind
utilities reach internal parts without a global stylesheet:

```ts
protected readonly pt: JigPassthrough<'select'> = {
  'popover-content': { $classes: 'max-h-64' },
};
```

```html
<jig-select [pt]="pt" />
```

### Scoping the tokens

By default token declarations land on `:root`. When the library runs inside a
page you do not own, scope them:

```ts
provideJigControls({
  theme: { preset: nova, styleScope: { kind: 'class', name: 'my-app' } },
});
```

The declarations are then emitted under `.my-app`, so nothing leaks into the
host page's `:root`.

### What not to do

- **`::ng-deep`** — deprecated, and unnecessary here: the cascade layer already
  gives you the win, and `pt` gives you a typed path.
- **`!important`** — a sign you are fighting the layer rather than using it.
- **Component `styles`** on a wrapper to reach a control's internals — the
  emulated encapsulation attribute is not on the control's inner elements.

### Related

- [Passthrough](/guides/passthrough) — the typed way into a control's internals
- [Kinds & Colors](/guides/kinds-colors) — the two built-in styling axes
- [Authoring a Theme](/guides/authoring-a-theme) — replacing parts wholesale
- [Configuration](/guides/configuration) — `cssLayer`, `styleScope`, `namePrefix`
