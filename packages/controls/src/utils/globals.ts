import { DOCUMENT, inject, Injectable } from '@angular/core';

const globalPropertyName = '__ngn-controls-global__';

interface NgnGlobalType {
  nextElementId: number;
  fancyLogging: boolean;
}

declare global {
  interface Window {
    [globalPropertyName]: NgnGlobalType;
  }
}

@Injectable()
export class NgnGlobal implements NgnGlobalType {
  private readonly _window = inject(DOCUMENT).defaultView || window;
  constructor() {
    this._window[globalPropertyName] ??= {
      nextElementId: 1,
      fancyLogging: true,
    };
  }

  public get nextElementId(): number {
    return this._window[globalPropertyName].nextElementId;
  }
  public set nextElementId(value: number) {
    this._window[globalPropertyName].nextElementId = value;
  }

  public get fancyLogging(): boolean {
    return this._window[globalPropertyName].fancyLogging;
  }
  public set fancyLogging(value: boolean) {
    this._window[globalPropertyName].fancyLogging = value;
  }
}
