The Avatar (`<awd-avatar>`) is a compact, square-ish badge that represents a
user or entity. It shows one of three things, in order of preference: projected
content (e.g. an icon), an `image`, or `initials`. If an `image` fails to load
it automatically falls back to the initials, so a broken URL never leaves an
empty box.

### Initials

Pass `initials` (and optionally `bgColor`) for a text avatar — the usual
fallback when no photo is available. Up to four characters are shown; longer
strings are truncated.

{{ demo: Demo_Avatar_Base }}

### Image

Give an `image` URL to render a photo; combine it with `initials` so the text
shows if the image can't be loaded. Always provide `alt` text for a meaningful
image.

{{ demo: Demo_Avatar_Image }}

### Size

`size` sets the diameter in pixels (default `48`) and scales the whole avatar
uniformly, keeping the image or initials centered.

{{ demo: Demo_Avatar_Size }}

### Icon

Projected content wins over both image and initials, so you can drop an
`<awd-icon>` (or any element) inside the avatar for a generic or role-based
placeholder.

{{ demo: Demo_Avatar_Icon }}

### Group

Wrap several avatars in `<awd-avatar-group>` to render them as an overlapping,
stacked cluster — the common pattern for showing the members of a team or the
participants in a thread, often ending with a `+N` initials avatar for the
overflow.

{{ demo: Demo_Avatar_Group }}
