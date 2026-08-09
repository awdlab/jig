Animations are pure CSS, defined in the theme. There is no animation package,
no `@angular/animations` dependency, and no JavaScript timeline — which is why
swapping the theme swaps the motion too.

### Enter and leave

Entering is straightforward: the element appears and the theme's CSS animation
runs.

Leaving is the hard part, because Angular removes an element the moment its
condition goes false. Two mechanisms handle it, and which one applies depends
on the theme.

**Transitions with `@starting-style`.** Nova and shade animate overlays with
ordinary CSS transitions plus `transition-behavior: allow-discrete` on
`display` and `overlay`. The browser keeps a top-layer element around for the
duration of its own transition, so no JavaScript coordination is needed at all.

**Keyframe leave animations.** Where a theme uses a keyframe animation instead
(material does, for toasts and snackbars), the control waits for it: on destroy
it looks for a running CSS animation whose name ends in **`-leave`**, on itself
or an ancestor, and defers its after-leave work until that animation finishes.

The name is the contract. In a theme part, produce it with the animation form
of the `c` helper, which yields `{prefix}{scope}-anim-leave`:

```ts
root: {
  css: ({ v, c }) => css`
    ${c('anim-leave')} {
      animation: ${c('anim-leave', 'animation')} ${v('anim.time.snappyFade')} both;
    }
    @keyframes ${c('anim-leave', 'animation')} {
      to {
        opacity: 0;
      }
    }
  `;
}
```

The checks for all elements destroyed in the same frame are batched into one
`requestAnimationFrame`, so a list of a hundred rows disappearing does not
cause a hundred interleaved layout reads.

### No flash on first render

Every control starts with an `awd-control-initializing` class that keeps it
hidden until it has laid out. It is removed after the first browser render —
and immediately on the server, so server HTML is complete and visible.

Do not target that class in your own CSS, and do not rely on it being present
at any particular moment.

### Turning animations off

Globally, through the [configuration](/guides/configuration):

```ts
provideNgnControls({ theme: { preset: nova }, disableAnimations: true });
```

This injects a stylesheet setting `animation-duration` and `transition-duration`
to `0s` for every control and its descendants. It deliberately does **not** set
`animation: none` — the animation still starts and ends, so `animationend`
fires and the leave-animation logic still completes. Everything just happens in
one frame.

That property makes it the right setting for tests: no waiting, no flakiness,
and no code path skipped.

### Reduced motion

`prefers-reduced-motion: reduce` is honoured automatically — nothing to wire
up. A stylesheet collapsing `animation-duration` and `transition-duration` to
`0.01ms` for every control and its descendants is injected behind that media
query, so motion disappears the moment the user's OS setting says so, and comes
back when it changes.

Near-zero rather than `none` or `0s`, for the same reason as
`disableAnimations`: anything the leave logic waits on still has to start and
finish.

Opt out through the [configuration](/guides/configuration) if your app already
handles reduced motion itself:

```ts
provideNgnControls({ theme: { preset: nova }, respectReducedMotion: false });
```

`disableAnimations` is the unconditional app-level switch; this one follows the
user's OS setting. They are independent, and either one turns motion off.

### Motion tokens

Durations and easings are theme tokens under `anim.time.*` and `anim.ease.*`,
emitted as CSS custom properties (`anim.time.snappyFade` becomes
`--awd-anim-time-snappy-fade`). Retiming the whole UI is a token override
rather than editing keyframes:

```css
:root {
  --awd-anim-time-snappy-fade: 120ms;
}
```

See [Theme Internals](/guides/theme-internals) for how token names are derived,
and [Authoring a Theme](/guides/authoring-a-theme) for writing the parts that
use them.

### Animating your own elements

Nothing stops you using the same tokens in your own CSS, and doing so keeps
your motion in step with the controls:

```css
.card {
  transition: box-shadow var(--awd-anim-time-snappy-fade) var(--awd-anim-ease-fade);
}
```
