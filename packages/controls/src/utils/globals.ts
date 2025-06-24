import { DOCUMENT, inject, Injectable } from '@angular/core';

const globalPropertyName = '__ngn-controls-global__';

interface NgnGlobalType {
  nextElementId: number;
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
    };
    console.log(this._window[globalPropertyName]);
  }

  public get nextElementId(): number {
    return this._window[globalPropertyName].nextElementId;
  }
  public set nextElementId(value: number) {
    this._window[globalPropertyName].nextElementId = value;
  }
}
