<div align="center">

<img src="https://raw.githubusercontent.com/NGneers/controls/main/apps/docs/public/img/logo.png" alt="@ngneers/controls" width="132" />

# @ngneers/controls

**A signal-based component library for Angular 22+**

60+ accessible, themeable, tree-shakeable controls. Zoneless, standalone — no `NgModule`s,
no `@Input()`/`@Output()` decorators, no `ControlValueAccessor` boilerplate.

[![Get Started](https://img.shields.io/badge/Get%20Started-e90464?style=for-the-badge)](https://ngneers.dev/guides/introduction)
[![Browse 60+ Components](https://img.shields.io/badge/Browse%2060%2B%20Components-f736e3?style=for-the-badge)](https://ngneers.dev/components)
[![Theming](https://img.shields.io/badge/Theming-8514f5?style=for-the-badge)](https://ngneers.dev/guides/overview)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-5c44e4?style=for-the-badge)](https://ngneers.dev/#demo)

<a href="https://ngneers.dev/#component-gallery"><img src="https://raw.githubusercontent.com/NGneers/controls/main/.github/assets/components-light.png" alt="Button, switch, slider, select, chip, tag, avatar, progress, tooltip, checkbox, tabs and input" width="880" /></a>

</div>

Controls ship **zero component CSS**: behavior, accessibility, and named style scopes live
here; styling comes from
[`@ngneers/controls-themes`](https://www.npmjs.com/package/@ngneers/controls-themes), which
is required at runtime.

## Install

```bash
pnpm add @ngneers/controls @ngneers/controls-themes
```

## Usage

```ts
import { provideNgnControls } from '@ngneers/controls/api/ng';
import { nova } from '@ngneers/controls-themes/nova';

// in your ApplicationConfig providers:
provideNgnControls({ theme: { preset: nova } });
```

Import each control from its own subpath so you only bundle what you use:

```ts
import { NgnButton } from '@ngneers/controls/button';
```

<div align="center">

<a href="https://ngneers.dev/#demo"><img src="https://raw.githubusercontent.com/NGneers/controls/main/.github/assets/chat-light.png" alt="A team chat app built from @ngneers/controls" width="880" /></a>

<sub>A chat app assembled from the library, running live on
<a href="https://ngneers.dev/#demo">ngneers.dev</a>.</sub>

</div>

## Documentation

Configuration, forms, theming, styling, accessibility, SSR, testing and migration guides
all live on the site, next to a runnable example and a props table for every control.

[![Read the docs](https://img.shields.io/badge/Read%20the%20docs-ngneers.dev-8514f5?style=for-the-badge)](https://ngneers.dev)

## License

MIT © NGneers
