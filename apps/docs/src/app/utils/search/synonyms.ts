/**
 * Query expansion for words the docs never use. Static embeddings place
 * "modal" near "dialog" only if the training corpus did; spelling the aliases
 * out is cheaper and deterministic than hoping.
 */
const SYNONYMS: Record<string, string> = {
  modal: 'dialog',
  popup: 'dialog popover overlay',
  dropdown: 'select listbox menu',
  combobox: 'select editable filter',
  autocomplete: 'select editable filter',
  // Toast, Snackbar and Message are near-synonyms in the wild but separate
  // controls here. Expand each to all three so they compete instead of one
  // stealing every phrasing.
  toast: 'toast snackbar message notification',
  snackbar: 'snackbar toast message notification',
  notification: 'toast snackbar message notification',
  alert: 'toast snackbar message notification',
  spinner: 'progress loading indicator',
  loader: 'progress loading indicator',
  switch: 'toggle checkbox',
  slider: 'range',
  datepicker: 'date picker calendar',
  textbox: 'input field',
  textfield: 'input field',
  textarea: 'input field multiline',
  grid: 'table',
  datagrid: 'table',
  pagination: 'paginator pages',
  breadcrumbs: 'breadcrumb navigation',
  tabs: 'tab group',
  accordion: 'collapsible expansion panel',
  tooltip: 'hint title',
  avatar: 'profile picture initials',
  theme: 'theming styling kind color',
  dark: 'dark mode color scheme',
  a11y: 'accessibility aria screen reader',
  i18n: 'internationalization translation locale',
  form: 'forms validation field',
  validation: 'invalid error validator',
  disable: 'disabled readonly',
  icon: 'icons iconify',
};

/** Appends aliases for any recognized word, leaving the original query intact. */
export function expandQuery(query: string): string {
  const extra = new Set<string>();
  for (const word of query.toLowerCase().split(/[^a-z0-9]+/)) {
    // Naive de-pluralization so "notifications" hits the "notification" entry.
    const aliases =
      SYNONYMS[word] ?? (word.endsWith('s') ? SYNONYMS[word.slice(0, -1)] : undefined);
    if (aliases) {
      extra.add(aliases);
    }
  }
  return extra.size > 0 ? `${query} ${[...extra].join(' ')}` : query;
}
