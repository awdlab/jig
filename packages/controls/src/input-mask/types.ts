export type InputMaskCfgEntry = {
  placeholder: string;
  accepts: RegExp;
  default: string;
};

export type NumberSegment = {
  kind: 'number';
  segment: string;
  min: number;
  max: number;
  length: number;
  placeholder?: string;
};

export type EnumSegment = {
  kind: 'enum';
  segment: string;
  values: string[];
  length: number;
  placeholder?: string;
};

export type MaskSegment = NumberSegment | EnumSegment;

export type InputMaskCfgInput = (InputMaskCfgEntry | MaskSegment | string)[];
export type InputMaskCfgResolved = (InputMaskCfgEntry | string)[];
export type InputMaskCfg = InputMaskCfgInput;

export type ResolvedSegment = {
  config: MaskSegment;
  positions: { start: number; end: number };
};

export type MaskResolution = {
  entries: InputMaskCfgResolved;
  segments: Map<string, ResolvedSegment>;
};
