export const globalPropertyName = '__ngn-controls-global__';

export interface NgnGlobalType {
  nextElementId: number;
  fancyLogging: boolean;
}

declare global {
  interface Window {
    [globalPropertyName]: NgnGlobalType;
  }
}
