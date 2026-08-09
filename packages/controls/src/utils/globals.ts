export const globalPropertyName = '__ngn-controls-global__';

export interface JigGlobalType {
  nextElementId: number;
  fancyLogging: boolean;
}

declare global {
  interface Window {
    [globalPropertyName]: JigGlobalType;
  }
}
