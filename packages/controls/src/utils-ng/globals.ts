import { DOCUMENT, inject, Injectable } from '@angular/core';
import { globalPropertyName, type AwdGlobalType } from '@awdlab/jig/utils';

@Injectable()
export class AwdGlobal implements AwdGlobalType {
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
