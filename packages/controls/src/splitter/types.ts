export type SplitterPanelSizeUnit = 'px' | 'fr';
export type SplitterPanelSize<U extends SplitterPanelSizeUnit = SplitterPanelSizeUnit> =
  `${number}${U}`;
