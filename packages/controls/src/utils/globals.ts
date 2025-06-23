const globalPropertyName = '__ngn-controls-global__';

export type NgnGlobal = {
  nextElementId: number;
};

declare global {
  interface Window {
    [globalPropertyName]: NgnGlobal;
  }
}

window[globalPropertyName] ??= {
  nextElementId: 1,
};

export const ngnGlobal = window[globalPropertyName];
