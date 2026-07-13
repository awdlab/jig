The Paginator (`<ngn-paginator>`) splits a large dataset into pages of navigable
buttons. Give it the required `totalItems` count and it derives the pages; it
does not slice your data itself — it tells you which slice to load, driving
either a page-based or an offset-based API. Reach for it below a table or list
backed by more rows than fit on one screen.

### Base

The current page is a zero-based `page` model (default `0`) and the page size a
`pageSize` model. Whenever either changes, the paginator emits a
`PaginationState` from its `value` output, giving you both a page view
(`{ current, size }`) and a ready-to-use slice (`{ skip, take }`):

```ts
onPage(state: PaginationState) {
  this.items = this.all.slice(state.slice.skip, state.slice.skip + state.slice.take);
}
```

By default the paginator offers page sizes `[5, 10, 25, 50]` (the first is used
until the user picks another) via a select next to the page buttons.

{{ demo: Demo_Paginator_Base }}

### Overflow Handling

When there are too many pages to show at once, the paginator condenses the middle
into an ellipsis and keeps the buttons around the current page visible, so the
control never overflows its container. Holding **Shift** while clicking
previous/next jumps 10 pages and **Ctrl** jumps 100; the current button is marked
`aria-current="page"` and the previous/next buttons carry translated
`aria-label`s.

{{ demo: Demo_Paginator_Overflow }}

### Custom Page Sizes

Override the choices with `possiblePageSizes` (they are sorted ascending
automatically). Set `fixedPageSize` to hide the size selector entirely and lock
the page size — useful when the size is dictated by the caller rather than the
user.

{{ demo: Demo_Paginator_Pagesize }}
