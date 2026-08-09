The Message component (`jig-message`) displays a persistent, inline block of
important information — a validation summary, a contextual note, a status
banner. Unlike a toast it stays in the layout where you place it and is not
dismissible; use it for information that belongs with the surrounding content
rather than transient feedback.

### Basic Usage

Content is projected, so a message can hold plain text or richer markup:

```html
<jig-message color="warning">Your trial ends in 3 days.</jig-message>
```

The severity is set with **`color`** (`info`, `success`, `warning`, `error`),
and the visual treatment with **`kind`** (nova/material: `default`, `outlined`,
`simple`; shade: `default`, `destructive`) —
both driven by the theme. The demo below renders every available kind/color
combination the current theme provides.

{{ demo: Demo_Message_Base }}

### Icon

Set the **`icon`** input to render a leading icon before the content, reinforcing
the severity at a glance. It accepts the same icon values as `jig-icon`.

{{ demo: Demo_Message_WithIcon }}
