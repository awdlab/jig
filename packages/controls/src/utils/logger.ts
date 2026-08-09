export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const Logger = new (class {
  public logLevel: LogLevel = 'info';

  public debug(...args: unknown[]) {
    if (this.logLevel === 'debug') {
      console.debug(...args);
    }
  }

  public info(...args: unknown[]) {
    if (this.logLevel === 'debug' || this.logLevel === 'info') {
      console.info(...args);
    }
  }

  public warn(...args: unknown[]) {
    if (this.logLevel === 'debug' || this.logLevel === 'info' || this.logLevel === 'warn') {
      console.warn(...args);
    }
  }

  public error(...args: unknown[]) {
    if (
      this.logLevel === 'debug' ||
      this.logLevel === 'info' ||
      this.logLevel === 'warn' ||
      this.logLevel === 'error'
    ) {
      console.error(...args);
    }
  }
})();
