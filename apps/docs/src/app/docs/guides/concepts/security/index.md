The library runs entirely in your app's origin: it makes no network requests,
loads no remote fonts or icons, ships no telemetry, and never evaluates code.
The two places it touches the page outside of its own templates are the
`<style>` elements it writes into `<head>`, and the storage it uses for
persisted UI state. Both are described below, along with what a strict
Content Security Policy needs from you.

### Content Security Policy

Theme CSS is generated at runtime, so every control scope you use adds a
`<style jig-style …>` element to `<head>`. Under a nonce-based policy the
browser drops any style element without a matching nonce — the app then loads,
works, and renders completely unstyled.

Give Angular the nonce and the library picks it up: it reads the
[`CSP_NONCE`](https://angular.dev/api/core/CSP_NONCE) token and stamps the value
on every style element it creates, exactly as Angular does for component styles.
There is no separate setting.

```html
<!-- index.html, rendered per request -->
<app-root ngCspNonce="{{ nonce }}"></app-root>
```

```ts
// …or provide the token explicitly
providers: [{ provide: CSP_NONCE, useValue: nonce }];
```

The nonce must be generated per request and appear both in the CSP header and in
the markup for that same response — a statically served `index.html` cannot do
this, so the value has to be injected by your server or your CDN edge.

Outside Angular, `applyTheme()` and `applyGlobalStyles()` take the value
directly:

```ts
applyTheme(nova, ['button'], { document, namePrefix: 'jig-', nonce });
```

#### Inline style attributes

A nonce applies to style **elements** only, never to `style` attributes. Angular
writes the static `style="…"` attributes from a template with `setAttribute`, and
a few control templates use them, so a policy that restricts `style-src` without
allowing style attributes strips that handful of rules:

```
Content-Security-Policy:
  default-src 'self';
  style-src 'self' 'nonce-{RANDOM}';
  style-src-attr 'unsafe-inline';
  script-src 'self' 'nonce-{RANDOM}';
```

`style-src-attr 'unsafe-inline'` only re-allows attributes; style elements still
need the nonce. Styles set through [passthrough](/guides/passthrough) `$styles`
are written via the CSSOM and are not affected by either directive.

#### Inline scripts

The library injects no scripts. The one inline script in the setup — the
pre-paint snippet from `colorSchemeInitScript()` that avoids a dark-mode flash,
see [Dark Mode](/guides/dark-mode) — is yours, and needs the same nonce on its
`<script>` tag (or a hash in `script-src`).

### Trusted Types

Nothing in the library assigns `innerHTML`, writes to the document, or calls
`eval`. One exception needs a policy entry: `jig-icon` builds an `<svg>` wrapper
around the icon body and marks it with `bypassSecurityTrustHtml`, which Angular
renders through its `angular#unsafe-bypass` policy.

```
Content-Security-Policy:
  require-trusted-types-for 'script';
  trusted-types angular angular#unsafe-bypass;
```

### Icons are trusted markup

Because icon bodies bypass the sanitizer, treat the icon registry as code, not
data. Register icons from packages you control (`@iconify/*`, your own assets) —
never icon data that reaches you from user input or a third-party endpoint.

### Passthrough attributes

`pt` values are applied to the real DOM node as given: `$attributes` goes
straight to `setAttribute` without passing Angular's sanitizer. Never build a
passthrough value — in particular `href`, `src` or an event-handler attribute —
out of untrusted input.

### Persisted state

State persistence (splitter sizes, table layout, filters, color scheme) writes
JSON to `localStorage`, `sessionStorage` or a cookie under keys you choose. All
three are readable by any script on the origin, and filter state can contain
whatever the user typed, so keep anything sensitive out of persisted controls.
See [State Persistence](/guides/state-persistence).

The cookie kind writes a non-`HttpOnly` cookie with `path=/`, `samesite=lax`, a
one-year `max-age`, and `secure` on HTTPS pages. It exists so the server can read
UI state during SSR; it carries no identity and is never read by the library for
anything else.
