import { DOCUMENT, inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { globalPropertyName, type JigGlobalType } from '@awdlab/jig/utils';

/** Carries the server's final id counter to the client so the two never issue the same id. */
const nextElementIdKey = makeStateKey<number>('jig-next-element-id');

@Injectable()
export class JigGlobal implements JigGlobalType {
  private readonly _window = inject(DOCUMENT).defaultView || window;
  private readonly _transferState = inject(TransferState);
  constructor() {
    this._window[globalPropertyName] ??= {
      nextElementId: this._transferState.get(nextElementIdKey, 1),
      fancyLogging: true,
    };
  }

  public get nextElementId(): number {
    return this._window[globalPropertyName].nextElementId;
  }
  public set nextElementId(value: number) {
    this._window[globalPropertyName].nextElementId = value;
    this._transferState.set(nextElementIdKey, value);
  }

  public get fancyLogging(): boolean {
    return this._window[globalPropertyName].fancyLogging;
  }
  public set fancyLogging(value: boolean) {
    this._window[globalPropertyName].fancyLogging = value;
  }
}
