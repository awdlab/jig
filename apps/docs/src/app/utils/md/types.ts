import type { Type } from '@angular/core';

export type MdCfg = {
  mdFile: string;
  components?: Type<unknown>[];
};
