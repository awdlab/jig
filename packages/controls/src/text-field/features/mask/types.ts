export type TextFieldMaskCfgEntry = {
  placeholder: string;
  accepts: RegExp;
  default: string;
};
export type TextFieldMaskCfg = (TextFieldMaskCfgEntry | string)[];
