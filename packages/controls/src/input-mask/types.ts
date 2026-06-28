// Public configuration (what callers pass via [mask])
export type NumberSegment = {
  kind: 'number';
  segment: string;
  min: number;
  max: number;
  /** Omit for a variable-length (non-padded) segment; provide for a fixed, zero-padded width. */
  length?: number;
  placeholder?: string;
};

export type EnumSegment = {
  kind: 'enum';
  segment: string;
  values: string[];
  placeholder?: string;
};

export type MaskSegment = NumberSegment | EnumSegment;

/** A mask config is an ordered list of segments and literal separator strings. */
export type InputMaskCfg = (MaskSegment | string)[];

// ---- Resolved model (internal) ----
export type Separator = { kind: 'sep'; text: string };

export type NumberField = {
  kind: 'number';
  name: string;
  min: number;
  max: number;
  /** Maximum digit count. */
  maxLen: number;
  /** When true, render to maxLen with leading zeros once the field is no longer the active one. */
  pad: boolean;
  placeholder: string;
};

export type EnumField = {
  kind: 'enum';
  name: string;
  values: string[];
  /** Maximum value length. */
  maxLen: number;
  placeholder: string;
};

export type Field = NumberField | EnumField;
export type Part = Separator | Field;
