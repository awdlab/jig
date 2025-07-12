export type SplitterPanelSizeUnit = 'px' | 'fr';
export type SplitterPanelSize<U extends SplitterPanelSizeUnit = SplitterPanelSizeUnit> =
  `${number}${U}`;

export type SplitterPanelSizeLimitUnit = 'px' | '%';
export type SplitterPanelSizeLimit<
  U extends SplitterPanelSizeLimitUnit = SplitterPanelSizeLimitUnit,
> = `${number}${U}`;

export type SplitterLayout = 'horizontal' | 'vertical';

type _SplitterState = {
  layout?: SplitterLayout;
  panelOrder?: string[] | null;
  panelSizes?: Record<string, SplitterPanelSize> | null;
};
export type SplitterStateData = keyof _SplitterState;
export type SplitterState = _SplitterState & {
  [key: string]: unknown;
};
