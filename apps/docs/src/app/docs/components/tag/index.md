The Tag is a small, **non-interactive** label for a piece of metadata — a
category, a status, a keyword. Put the label between the tags
(`<ngn-tag>Draft</ngn-tag>`), optionally set a leading `icon`, and use the
shared `kind` and `color` inputs to select a themed variant.

A tag carries no click, close, or focus behaviour — it is display only. When the
element needs to be actionable (clickable, selectable, or removable), reach for
the **chip** instead.

### Basic Usage

`kind` and `color` map onto the theme's registered tag variants.

{{ demo: Demo_Tag_Base }}

### Tag with Icon

The `icon` input renders an icon ahead of the tag's content.

{{ demo: Demo_Tag_WithIcon }}
