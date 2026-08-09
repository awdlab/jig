<img src="https://raw.githubusercontent.com/awdlab/jig/main/apps/docs/public/img/logo.png?v=3" alt="@awdlab/jig" width="132" />

# @awdlab/jig

**A signal-based component library for Angular 22+**

60+ accessible, themeable, tree-shakeable controls. Zoneless, standalone — no `NgModule`s,
no `@Input()`/`@Output()` decorators, no `ControlValueAccessor` boilerplate.

[![Get Started](https://img.shields.io/badge/Get%20Started-e90464?style=for-the-badge)](https://jig.awdlab.dev/guides/introduction)
[![Browse 60+ Components](https://img.shields.io/badge/Browse%2060%2B%20Components-f736e3?style=for-the-badge)](https://jig.awdlab.dev/components)
[![Theming](https://img.shields.io/badge/Theming-8514f5?style=for-the-badge)](https://jig.awdlab.dev/guides/overview)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-5c44e4?style=for-the-badge)](https://jig.awdlab.dev/#demo)

<a href="https://jig.awdlab.dev/#component-gallery"><img src="https://raw.githubusercontent.com/awdlab/jig/main/.github/assets/components-light.png" alt="Button, switch, slider, select, chip, tag, avatar, progress, tooltip, checkbox, tabs and input" width="880" /></a>

Controls ship **zero component CSS**: behavior, accessibility, and named style scopes live
here; styling comes from
[`@awdlab/jig-themes`](https://www.npmjs.com/package/@awdlab/jig-themes), which
is required at runtime.

## Install

```bash
pnpm add @awdlab/jig @awdlab/jig-themes
```

## Usage

```ts
import { provideJigControls } from '@awdlab/jig/api/ng';
import { nova } from '@awdlab/jig-themes/nova';

// in your ApplicationConfig providers:
provideJigControls({ theme: { preset: nova } });
```

Import each control from its own subpath so you only bundle what you use:

```ts
import { JigButton } from '@awdlab/jig/button';
```

<div align="center">

<a href="https://jig.awdlab.dev/#demo"><img src="https://raw.githubusercontent.com/awdlab/jig/main/.github/assets/chat-light.png" alt="A team chat app built from @awdlab/jig" width="880" /></a>

<sub>A chat app assembled from the library, running live on
<a href="https://jig.awdlab.dev/#demo">jig.awdlab.dev</a>.</sub>

</div>

## Documentation

Configuration, forms, theming, styling, accessibility, SSR, testing and migration guides
all live on the site, next to a runnable example and a props table for every control.

[![Read the docs](https://img.shields.io/badge/Read%20the%20docs-jig.awdlab.dev-8514f5?style=for-the-badge)](https://jig.awdlab.dev)

## License

MIT © awdlab
