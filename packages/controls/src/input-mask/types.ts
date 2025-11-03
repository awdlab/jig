export type InputMaskCfgEntry = {
  placeholder: string;
  accepts: RegExp;
  default: string;
};
export type InputMaskCfg = (InputMaskCfgEntry | string)[];
