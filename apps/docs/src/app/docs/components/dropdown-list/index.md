`jig-dropdown-list` is an anchored popover wrapping a [list box](/components/list-box) — the
dropdown half of a combobox. It owns the fiddly parts: opening and closing, forwarding
navigation keys to the list, the `aria-controls` / `aria-activedescendant` ids, scrolling the
selected row into view, and closing on select.

[`jig-select`](/components/select) and [`jig-tag-input`](/components/tag-input) are both built
on it, and it works on its own wherever a trigger should open a list.

### Basic usage

Give it an `anchor` — the element it hangs off — and call `toggle()` from the trigger.

{{ demo: Demo_DropdownList_Base }}

### Width

Width is an ordinary popover option rather than a mode of its own. Pass
`sizeConstraints.width: 1` to match the anchor's width — `1` means one times the anchor — or
leave it out for a content-sized list, which is what a slim icon button wants.

{{ demo: Demo_DropdownList_AnchorWidth }}

### Grouped items

Grouped items render with sticky group headers, and `separator` draws a divider above each
group.

{{ demo: Demo_DropdownList_Grouped }}

### Templates and the header slot

`templateItem` (or an `<ng-template #item>`) replaces an item's rendering. Content marked
`dropdownHeader` is projected above the list — this is how `jig-select` puts its filter field
inside the popover. The slot contributes no spacing of its own, so give projected content its
own padding.

{{ demo: Demo_DropdownList_Templates }}
