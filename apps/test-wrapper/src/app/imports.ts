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
  icon: () => import('@ngneers/controls/icon').then((m) => m.NgnIcon),
  inplace: () => import('@ngneers/controls/inplace').then((m) => m.NgnInplace),
  input: () => import('@ngneers/controls/input').then((m) => m.NgnInput),
  inputField: () =>
    import('@ngneers/controls/input-field').then((m) => m.NgnInputField),
  inputMask: () =>
    import('@ngneers/controls/input-mask').then((m) => m.NgnInputMask),
  itemView: () =>
    import('@ngneers/controls/item-view').then((m) => m.NgnItemView),
  listBox: () => import('@ngneers/controls/list-box').then((m) => m.NgnListBox),
  message: () => import('@ngneers/controls/message').then((m) => m.NgnMessage),
  popover: () => import('@ngneers/controls/popover').then((m) => m.NgnPopover),
  scroller: () =>
    import('@ngneers/controls/scroller').then((m) => m.NgnScroller),
  select: () => import('@ngneers/controls/select').then((m) => m.NgnSelect),
  splitter: () =>
    import('@ngneers/controls/splitter').then((m) => m.NgnSplitter),
  tabs: () => import('@ngneers/controls/tabs').then((m) => m.NgnTabs),
  tag: () => import('@ngneers/controls/tag').then((m) => m.NgnTag),
  tooltip: () => import('@ngneers/controls/tooltip').then((m) => m.NgnTooltip),
  dummy_component: () =>
    import('./helper-components/dummy').then((m) => m.DummyComponent),
};
