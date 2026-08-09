---
title: Filterable, paginated table
summary: A data table with column filtering and pagination.
controls: table, filter, paginator, input, select, tag
---

# Filterable, paginated table

Combine `awd-table` for the grid, `awd-filter` (or plain inputs) for filtering,
and `awd-paginator` for paging. Keep the source data and the derived view in
signals so filtering + paging are pure `computed()` transforms.

## Shape

- Hold raw rows in a `signal()`; derive the filtered + paged view with
  `computed()`.
- Drive the paginator's `pageSize` / `total` from the derived view.
- Use `awd-filter` for operator-based column filtering, or bind simple
  `input[ngnInput]` / `awd-select` controls to filter signals.
- Render status/labels inside cells with `awd-tag`.

## Skeleton

```html
<awd-filter [(value)]="query" />

<awd-table [rows]="pagedRows()">
  <!-- columns per awd-table docs; verify with get_control -->
</awd-table>

<awd-paginator [(page)]="page" [pageSize]="pageSize()" [total]="filtered().length" />
```

```ts
readonly rows = signal<Row[]>([]);
readonly query = signal('');
readonly page = signal(0);
readonly pageSize = signal(20);

readonly filtered = computed(() =>
  this.rows().filter(r => matches(r, this.query()))
);
readonly pagedRows = computed(() =>
  this.filtered().slice(this.page() * this.pageSize(), (this.page() + 1) * this.pageSize())
);
```

## Notes

- `awd-table`'s column/template model is specific — read its docs with
  `get_control` before laying out columns.
- Reset `page` to 0 whenever the filter query changes.
- The table can also sort/filter/paginate the `rows` array itself via its own
  `ngnTableSortableColumn` / `ngnTableFilterableColumn` directives and
  `paginator` input — reach for the manual pipeline above only when you need the
  derived view elsewhere.
- For server-driven data pass `dataSource` instead of `rows`: sorting, filtering
  and paging are delegated to the loader (offset or cursor, plus infinite
  scroll), and grouping is unsupported. `virtual` is about rendering only and
  combines with it.
