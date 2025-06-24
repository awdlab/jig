import { inject } from '@angular/core';

const globalPropertyName = '__ngn-controls-global__';

export type NgnGlobal = {
  nextElementId: number;
};

declare global {
  interface Window {
    [globalPropertyName]: NgnGlobal;
  }
}

const window = inject(Window);

window[globalPropertyName] ??= {
  nextElementId: 1,
};

export const ngnGlobal = window[globalPropertyName];
