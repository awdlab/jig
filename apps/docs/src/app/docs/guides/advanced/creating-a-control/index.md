A control is a **7-part unit** spanning three packages. A new input or rename must be
propagated across all of them.

| #   | Part           | Location                                                                        |
| --- | -------------- | ------------------------------------------------------------------------------- |
| 1   | Control source | `packages/controls/src/{name}/` — `.ts`, `.html`, `index.ts`, `ng-package.json` |
| 2   | Theme template | `packages/themes/src/templates/{name}/index.ts`                                 |
| 3   | Base theme     | `packages/themes/src/base/{name}/index.ts`                                      |
| 4   | Themed parts   | `packages/themes/src/{nova,shade,material}/{name}/index.ts`                     |
| 5   | Tests          | `tests/components/{name}.test.ts`                                               |
| 6   | Docs page      | `apps/docs/src/app/docs/components/{name}/`                                     |
| 7   | Demos          | `apps/docs/src/app/demos/{name}/`                                               |

### Recipe

**1. Declare the theme template** — the scope + class-name slots. This is the contract the
control and theme share.

```ts
// packages/themes/src/templates/widget/index.ts
import { createControlTemplate } from '@ngneers/controls-themes/api';

export const widgetControlTemplate = createControlTemplate({
  scope: 'widget',
  classNames: ['root', 'icon', 'content'],
});
```

**2. Register the scope** by adding it to the `ThemeTemplate` map in
`packages/themes/src/templates/index.ts` — this makes `'widget'` a valid `ControlName`.

**3. Write the component.** Extend `NgnBase<'scope'>` (presentational/attribute) or
`ValueControlBase<'scope', V>` (form value). Add `provideSelf(Class)` so ancestors can find
it via DI. Assign `injectThemeTemplate(...)` to the `theme` field; the optional second
argument maps host classes to state.

```ts
// packages/controls/src/widget/widget.ts
import { Component, input } from '@angular/core';
import { NgnBase, provideSelf, NgnPt } from '@ngneers/controls/base';
import { widgetControlTemplate } from '@ngneers/controls-themes/templates/widget';

@Component({
  selector: 'ngn-widget', // ngn- prefix, kebab === folder name
  templateUrl: './widget.html',
  imports: [NgnPt],
  providers: [provideSelf(NgnWidget)],
})
export class NgnWidget extends NgnBase<'widget'> {
  protected readonly theme = this.injectThemeTemplate(widgetControlTemplate, 'root');

  /** Text shown after the icon. */
  public readonly label = input('');
}
```

**4. Write the template.** No `class="..."` for styling — tag each element with
`[ptInt]="this"` + `[ptClass]="'slot'"` to apply that scope's theme class (and let
consumers pass through to it).

```html
<div [ptInt]="this" [ptClass]="'content'"><ng-content /></div>
```

**5. Barrel + package.** `index.ts` re-exports the class; `ng-package.json` is
`{ "lib": { "entryFile": "index.ts" } }`.

**6. Base + themed parts.** `createThemePart` for the structural base and for every shipped
theme — nova, shade, and material (see [Authoring a Theme](/guides/authoring-a-theme)) —
then register each in `base/index.ts`, `nova/index.ts`, `shade/index.ts`,
`material/index.ts` and add it to that theme's part array. Register any `kind`s in each
theme's `KINDS` metadata. A new part folder also needs an empty `package.json` marker and a
themes build before it resolves.

**7. Docs, demos, tests** for parts 5–7 above.

### Conventions (enforced)

- **Selector:** `ngn-{name}` element, or a camelCase attribute (`ngnButton`, `ngnInput`)
  for directives on native elements. Folder name and selector are the same kebab-case.
- **Signals only:** `input()` / `model()` / `output()` — never `@Input()`/`@Output()`.
- **Booleans:** `input(false, { transform: booleanAttribute })`.
- **Icon inputs:** `icon`-prefixed (`iconClose`, not `closeIcon`).
- **Directive input aliases:** `ngn{Directive}{Prop}`, where the alias suffix equals the
  property name (the `no-input-rename` convention).
- **No component CSS** — styling only through theme parts.
- Controls with template/projection inputs extract a `{Name}Templates` base class; flat
  controls extend the base directly.

### Gotchas

- The abstract `theme` field is required. Attribute directives with no template set
  `theme = null`; a `null` theme silently disables `kind`/`color` classes.
- `injectThemeTemplate` only wires state→class on the host when you pass the second
  (mapping) argument; a bare scope string does not.
- The mapping callbacks must read signals to stay reactive.
- `provideSelf` uses `forwardRef` — pass the class, not an instance.

For how these parts become CSS at runtime, see [Theme Internals](/guides/theme-internals).
