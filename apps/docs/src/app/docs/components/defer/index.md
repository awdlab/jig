`awd-defer` delays creating a piece of UI until it is first shown, and
optionally keeps it alive afterwards. It is what overlay-style controls use so
their contents cost nothing until opened.

It is a **rendering** primitive, not a loading one: unlike Angular's `@defer`
block, it does not lazy-load a chunk. It decides whether a template is
instantiated at all.

### Basic Usage

Pass the content as a `TemplateRef` via `lazyContent`. Nothing inside it is
constructed until `open` first becomes `true`:

{{ demo: Demo_Defer_Base }}

Toggle "keep rendered" and reopen: with `cache` off the template is destroyed
and rebuilt each time, with `cache` on it is built once and reused.

### Projected Content Is Not Deferred

This is the one thing to get right:

```html
<!-- deferred: the template is instantiated on first open -->
<awd-defer [open]="open()" [lazyContent]="body" />
<ng-template #body><expensive-thing /></ng-template>

<!-- NOT deferred: the parent creates this content immediately -->
<awd-defer [open]="open()">
  <expensive-thing />
</awd-defer>
```

Projected content is created by the **parent** component, so `awd-defer` never
gets the chance to withhold it — it can only hide it. Use projection when you
want the visibility behaviour without the deferral; use `lazyContent` when you
want the deferral.

### When the Template Exists

`open`, `lazy` and `cache` combine to decide whether the template is
instantiated at all:

| `lazy`  | `cache` | Template exists                       |
| ------- | ------- | ------------------------------------- |
| `true`  | `false` | only while `open` is `true` (default) |
| `true`  | `true`  | from the first open onwards, forever  |
| `false` | any     | always, from the very first render    |

### Passing Context

`lazyContentContext` is handed to the template as its context object, so the
usual `let-` bindings work:

```html
<awd-defer [open]="open()" [lazyContent]="row" [lazyContentContext]="{ $implicit: user() }" />

<ng-template #row let-user> {{ user.name }} </ng-template>
```

### Hidden, Not Removed

While closed, the host stays in the DOM and is moved off-screen with
`visibility: hidden` and `aria-hidden="true"`, rather than being removed. That
keeps the element measurable — which is what overlays need in order to position
themselves before they appear.

Set `[hiddenOnClosed]="false"` when you want the host to keep participating in
layout while closed.

> Because the host is only visually hidden, anything focusable inside it is
> still hidden from assistive technology via `aria-hidden` but not from the tab
> order in every engine. Prefer `cache="false"` for content with focusable
> elements, so it genuinely does not exist while closed.

### When to Use What

| Need                                              | Use                                                 |
| ------------------------------------------------- | --------------------------------------------------- |
| Skip the JavaScript for a route/feature entirely  | Angular `@defer` with `loadChildren`/dynamic import |
| Skip constructing a subtree until it is shown     | `awd-defer` with `lazyContent`                      |
| Simply add/remove a subtree                       | `@if`                                               |
| Keep an expensive subtree alive across open/close | `awd-defer` with `cache`                            |
