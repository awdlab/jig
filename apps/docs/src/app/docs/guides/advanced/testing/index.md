Because a control ships no CSS of its own and renders through a theme, the DOM
you assert against is generated — hand-written selectors break the moment a
theme part changes. `@awdlab/jig-playwright` exists so you never write
one.

```bash
pnpm add -D @awdlab/jig-playwright
```

### Harnesses

Each control has a `jig*Harness` that wraps its DOM and speaks in terms of the
control's behaviour:

```ts
import { JigSelectHarness } from '@awdlab/jig-playwright';

test('picks an option', async ({ page }) => {
  const select = new JigSelectHarness(page.locator('jig-select'));

  await select.open();
  await select.clickItemByText('Option 2');
  await select.expectSelectedItemText('Option 2');
});
```

A harness takes a `Locator` for the control's host element and exposes:

- **actions** — `open()`, `close()`, `clickItemByText()`, …
- **assertions** — `expectOpened()`, `expectSelectedItemText()`, … which wrap
  Playwright's auto-retrying `expect`, so they wait rather than flake;
- **sub-locators and nested harnesses** — `select.listBox`, `select.filter`,
  `select.popoverContent` — for the cases the shorthand does not cover.

The assertions encode the timing rules the DOM alone does not tell you. For
example `JigSelectHarness.expectOpened()` waits for the trigger's
`aria-expanded`, not merely for the panel to be visible — the panel is painted
a frame before the popover actually enters the top layer, and asserting on
visibility alone lets a following Escape keypress get lost.

### Selectors, when you need them

`JIG_CLASSES` holds the generated class selectors for the common controls, and
`themeClasses(template)` derives them for any control template:

```ts
import { JIG_CLASSES, themeClasses } from '@awdlab/jig-playwright';
import { tagControlTemplate } from '@awdlab/jig-themes/templates/tag';

page.locator(JIG_CLASSES.button.root);
page.locator(themeClasses(tagControlTemplate).label);
```

These stay correct as themes change, because they are built from the same
control templates the theme uses. Prefer them over literal class strings.

Best of all, prefer neither: assert on **role and accessible name**
(`getByRole('option', { name: 'Berlin' })`). That tests what a user perceives,
and it doubles as an accessibility check.

### Unit tests

For component tests, `provideJigControls` is all the setup needed — with a
theme preset, or controls throw:

```ts
import { TestBed } from '@angular/core/testing';
import { provideJigControls } from '@awdlab/jig/api/ng';
import { nova } from '@awdlab/jig-themes/nova';

TestBed.configureTestingModule({
  providers: [provideJigControls({ theme: { preset: nova }, disableAnimations: true })],
});
```

`disableAnimations: true` is worth setting everywhere in tests. It sets every
animation and transition duration to `0s` rather than removing them, so
animation start/end events still fire and controls that wait for a leave
animation still complete — they just complete immediately.

Two more things worth knowing in unit tests:

- Controls resolve their theme classes at runtime, so assert on behaviour and
  ARIA, not on class names.
- A control's `AbstractControl` binding resolves a microtask after creation.
  `await fixture.whenStable()` before asserting on validation state.

### End-to-end setup

The library needs no special Playwright configuration. Run the app under test
as usual — a `webServer` entry in `playwright.config.ts` starts the dev server
for you, so no manual server is needed before a run.

For theme-dependent visual checks, remember that the CSS is injected at runtime
as each control first appears. Wait for the control itself (any harness
assertion does) rather than for a stylesheet.

### What to test

The controls are already tested — their keyboard model, ARIA and theming ship
covered. Your tests should be about **your** application:

- the data reaching the control, and the value coming back;
- validation rules and the messages they produce;
- flows across controls (open dialog → fill form → submit).

Testing that a select opens on click is testing the library.

### Accessibility in CI

Both an axe scan and a keyboard pass are worth automating. The library targets
WCAG 2.2 AA — see [Accessibility](/guides/accessibility) for what that covers
and what is still yours to get right.

```ts
import AxeBuilder from '@axe-core/playwright';

const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .analyze();

expect(results.violations).toEqual([]);
```
