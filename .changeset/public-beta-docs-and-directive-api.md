---
'@ngneers/controls': patch
'@ngneers/controls-mcp': patch
---

Document the directive API and fix two i18n gaps.

- Every public directive and the remaining table structure directives now carry
  `@category`, so they appear in the generated API tables and in the MCP
  knowledge pack: `ngnAutofocus`, `ngnMovable`, `ngnResizable`, `ngnScrollAmount`,
  `ngnDrag`, `ngnDragScroll`, `ngnRovingGroup`/`ngnRovingItem`, `ngnContextMenu`,
  `ngn-action-button`, `ngnScrollerItem`, and the table's `th`/`td`/`tr`,
  sticky-column and row-actions directives.
- `customTranslations` languages are now selectable. They were registered but
  never added to `availableLanguages`, so `setLanguage('fr')` silently fell back
  to English.
- Translation loading is tracked with `PendingTasks`, so server-side rendering
  waits for the locale instead of serializing raw key paths that were then
  swapped out on hydration.
