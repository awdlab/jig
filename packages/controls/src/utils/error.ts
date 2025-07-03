export function throwExp(moduleName: string, errorMsg: string): never {
  throw new NgnError(moduleName, errorMsg);
}

export class NgnError extends Error {
  constructor(area: string, errorMsg: string) {
    if (typeof window !== 'undefined' && window['__ngn-controls-global__'].fancyLogging) {
      console.log(
        `%c💥%c[${area}]`,
        'font-size: 24px;',
        'color: #ff0042; font-size: 20px; background-color: #000000;'
      );
    }

    super(`[${area}] ${errorMsg}`);
    this.name = 'NgnError';
  }
}
