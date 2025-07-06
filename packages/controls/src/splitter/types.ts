export type SplitterPanelSizeUnit = 'px' | 'fr';
export type SplitterPanelSize<U extends SplitterPanelSizeUnit = SplitterPanelSizeUnit> =
  `${number}${U}`;

export type SplitterPanelSizeLimitUnit = 'px' | '%';
export type SplitterPanelSizeLimit<
  U extends SplitterPanelSizeLimitUnit = SplitterPanelSizeLimitUnit,
> = `${number}${U}`;

export type SplitterLayout = 'horizontal' | 'vertical';
export type SplitterState = {
  layout?: SplitterLayout;
  panelOrder?: string[] | null;
  panelSizes?: Record<string, SplitterPanelSize> | null;
  [key: string]: unknown;
};
