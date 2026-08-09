export const globalPropertyName = '__jig-global__';

export interface JigGlobalType {
  nextElementId: number;
  fancyLogging: boolean;
}

declare global {
  interface Window {
    [globalPropertyName]: JigGlobalType;
  }
}
