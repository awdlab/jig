# @ngneers/controls

The control components and directives of **[@ngneers/controls](https://ngneers.dev)** — a
modern, signal-based component library for Angular 22+.

Controls ship **zero component CSS**: behavior, accessibility, and named style scopes live
here; styling is provided by [`@ngneers/controls-themes`](https://www.npmjs.com/package/@ngneers/controls-themes),
which is required at runtime.

## Install

```bash
pnpm add @ngneers/controls @ngneers/controls-themes
```

## Usage

```ts
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { novaCoral } from '@ngneers/controls-themes/nova';

// in your ApplicationConfig providers:
provideNgnControls({ theme: { preset: novaCoral } });
```

Import each control from its own subpath so you only bundle what you use:

```ts
import { NgnButton } from '@ngneers/controls/button';
```

📚 Full documentation, theming, and per-control API: **[ngneers.dev](https://ngneers.dev)**

## License

MIT © NGneers
