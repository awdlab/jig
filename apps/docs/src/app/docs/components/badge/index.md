The Badge (`[jigBadge]`) is an attribute directive that overlays a small count,
label, or status dot onto any host element — an icon, button, or avatar. The host
is made `position: relative` automatically so the badge can anchor to a corner.

### Basic Usage

Apply `[jigBadge]` with a number or string. A numeric value can be capped with
`jigBadgeMax`. The badge carries a background-colored ring so it stays legible on
any anchor.

{{ demo: Demo_Badge_Base }}

> **Clipping hosts:** the badge overhangs its host's corner, so if the host clips
> its overflow (e.g. `jig-avatar`, which is `overflow: hidden` to round its
> content), place `[jigBadge]` on a thin wrapper around it — such as
> `<span class="inline-flex" [jigBadge]="5"><jig-avatar … /></span>` — rather than
> on the element itself. Non-clipping hosts like buttons and icons take
> `[jigBadge]` directly.

### Positions

Use `jigBadgePosition` to move the badge to any corner.

{{ demo: Demo_Badge_Positions }}

### Dot

Set `jigBadgeDot` for a value-less status dot.

{{ demo: Demo_Badge_Dot }}

### Custom Color

`jigBadgeColor` takes any CSS color or `var(...)` reference.

{{ demo: Demo_Badge_Color }}
