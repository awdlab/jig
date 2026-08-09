export const globalPropertyName = '__ngn-controls-global__';

export interface AwdGlobalType {
  nextElementId: number;
  fancyLogging: boolean;
}

declare global {
  interface Window {
    [globalPropertyName]: AwdGlobalType;
  }
}
