export function throwExp(
  moduleName: string,
  errorMsg: string,
  ...additionalContext: unknown[]
): never {
  throw new NgnError(moduleName, errorMsg, ...additionalContext);
}

export class NgnError extends Error {
  public readonly additionalContext?: unknown[];
  constructor(area: string, errorMsg: string, ...additionalContext: unknown[]) {
    if (typeof window !== 'undefined' && window['__ngn-controls-global__']?.fancyLogging) {
      console.log(
        `%c💥%c[${area}]`,
        'font-size: 24px;',
        'color: #ff0042; font-size: 20px; background-color: #000000;',
        ...additionalContext
      );
    }

    super(`[${area}] ${errorMsg}`);
    this.name = 'NgnError';
    this.additionalContext = additionalContext;
  }
}
