export const IMPORTS = {
  accordion: () =>
    import('@ngneers/controls/accordion').then((m) => m.NgnAccordion),
  accordionPanel: () =>
    import('@ngneers/controls/accordion').then((m) => m.NgnAccordionPanel),
  avatar: () => import('@ngneers/controls/avatar').then((m) => m.NgnAvatar),
  avatarGroup: () =>
    import('@ngneers/controls/avatar').then((m) => m.NgnAvatarGroup),
  breadcrumb: () =>
    import('@ngneers/controls/breadcrumb').then((m) => m.NgnBreadcrumb),
  button: () => import('@ngneers/controls/button').then((m) => m.NgnButton),
  buttonGroup: () =>
    import('@ngneers/controls/button-group').then((m) => m.NgnButtonGroup),
  calendar: () =>
    import('@ngneers/controls/calendar').then((m) => m.NgnCalendar),
  checkbox: () =>
    import('@ngneers/controls/checkbox').then((m) => m.NgnCheckbox),
  chip: () => import('@ngneers/controls/chip').then((m) => m.NgnChip),
  defer: () => import('@ngneers/controls/defer').then((m) => m.NgnDefer),
  dialog: () => import('@ngneers/controls/dialog').then((m) => m.NgnDialog),
  editInplace: () =>
    import('@ngneers/controls/edit-inplace').then((m) => m.NgnEditInplace),
  errors: () => import('@ngneers/controls/errors').then((m) => m.NgnErrors),
  filter: () => import('@ngneers/controls/filter').then((m) => m.NgnFilter),
  forms: () => import('@angular/forms').then((m) => m.FormsModule),
  reactiveForms: () =>
    import('@angular/forms').then((m) => m.ReactiveFormsModule),
  hint: () => import('@ngneers/controls/hint').then((m) => m.NgnHint),
  icon: () => import('@ngneers/controls/icon').then((m) => m.NgnIcon),
  inplace: () => import('@ngneers/controls/inplace').then((m) => m.NgnInplace),
  input: () => import('@ngneers/controls/input').then((m) => m.NgnInput),
  inputField: () =>
    import('@ngneers/controls/input-field').then((m) => m.NgnInputField),
  maskInput: () =>
    import('@ngneers/controls/mask-input').then((m) => m.NgnMaskInput),
  itemView: () =>
    import('@ngneers/controls/item-view').then((m) => m.NgnItemView),
  listBox: () => import('@ngneers/controls/list-box').then((m) => m.NgnListBox),
  message: () => import('@ngneers/controls/message').then((m) => m.NgnMessage),
  numberInput: () =>
    import('@ngneers/controls/number-input').then((m) => m.NgnNumberInput),
  popover: () => import('@ngneers/controls/popover').then((m) => m.NgnPopover),
  progress: () =>
    import('@ngneers/controls/progress').then((m) => m.NgnProgress),
  radioGroup: () =>
    import('@ngneers/controls/radio').then((m) => m.NgnRadioGroup),
  radio: () => import('@ngneers/controls/radio').then((m) => m.NgnRadio),
  scrollShadow: () =>
    import('@ngneers/controls/scroll-shadow').then((m) => m.NgnScrollShadow),
  scroller: () => [
    import('@ngneers/controls/scroller').then((m) => m.NgnScroller),
    import('@ngneers/controls/scroller').then((m) => m.NgnScrollerItem),
  ],
  select: () => import('@ngneers/controls/select').then((m) => m.NgnSelect),
  selectButton: () =>
    import('@ngneers/controls/select-button').then((m) => m.NgnSelectButton),
  slider: () => import('@ngneers/controls/slider').then((m) => m.NgnSlider),
  snackbar: () =>
    import('@ngneers/controls/snackbar').then((m) => m.NgnSnackbar),
  spinButtons: () =>
    import('@ngneers/controls/spin-buttons').then((m) => m.NgnSpinButtons),
  spinner: () => import('@ngneers/controls/spinner').then((m) => m.NgnSpinner),
  state: () => import('@ngneers/controls/state').then((m) => m.NgnState),
  splitter: () =>
    import('@ngneers/controls/splitter').then((m) => m.NgnSplitter),
  splitterPanel: () =>
    import('@ngneers/controls/splitter').then((m) => m.NgnSplitterPanel),
  switch: () => import('@ngneers/controls/switch').then((m) => m.NgnSwitch),
  tabs: () => import('@ngneers/controls/tabs').then((m) => m.NgnTabs),
  tab: () => import('@ngneers/controls/tabs').then((m) => m.NgnTab),
  table: () => import('@ngneers/controls/table').then((m) => m.NgnTable),
  tableModule: () =>
    import('@ngneers/controls/table').then((m) => m.NgnTableModule),
  tableSelectionColumn: () =>
    import('@ngneers/controls/table').then((m) => m.NgnTableSelectionColumn),
  tableStickyColumn: () =>
    import('@ngneers/controls/table').then((m) => m.NgnTableStickyColumn),
  ngnTemplate: () =>
    import('@ngneers/controls/api/ng').then((m) => m.NgnTemplate),
  tag: () => import('@ngneers/controls/tag').then((m) => m.NgnTag),
  toast: () => import('@ngneers/controls/toast').then((m) => m.NgnToast),
  toggleButton: () =>
    import('@ngneers/controls/toggle-button').then((m) => m.NgnToggleButton),
  tooltip: () => import('@ngneers/controls/tooltip').then((m) => m.NgnTooltip),
  tree: () => import('@ngneers/controls/tree').then((m) => m.NgnTree),
  upload: () => import('@ngneers/controls/upload').then((m) => m.NgnUpload),
  dummy_component: () =>
    import('./helper-components/dummy').then((m) => m.DummyComponent),
  testAsyncValidator: () =>
    import('./helper-components/async-validator').then(
      (m) => m.TestAsyncValidator,
    ),
};
