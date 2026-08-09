The Badge (`[ngnBadge]`) is an attribute directive that overlays a small count,
label, or status dot onto any host element — an icon, button, or avatar. The host
is made `position: relative` automatically so the badge can anchor to a corner.

### Basic Usage

Apply `[ngnBadge]` with a number or string. A numeric value can be capped with
`ngnBadgeMax`. The badge carries a background-colored ring so it stays legible on
any anchor.

{{ demo: Demo_Badge_Base }}

> **Clipping hosts:** the badge overhangs its host's corner, so if the host clips
> its overflow (e.g. `awd-avatar`, which is `overflow: hidden` to round its
> content), place `[ngnBadge]` on a thin wrapper around it — such as
> `<span class="inline-flex" [ngnBadge]="5"><awd-avatar … /></span>` — rather than
> on the element itself. Non-clipping hosts like buttons and icons take
> `[ngnBadge]` directly.

### Positions

Use `ngnBadgePosition` to move the badge to any corner.

{{ demo: Demo_Badge_Positions }}

### Dot

Set `ngnBadgeDot` for a value-less status dot.

{{ demo: Demo_Badge_Dot }}

### Custom Color

`ngnBadgeColor` takes any CSS color or `var(...)` reference.

{{ demo: Demo_Badge_Color }}
