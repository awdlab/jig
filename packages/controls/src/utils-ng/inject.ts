import { inject, type ProviderToken } from '@angular/core';
import { throwExp } from '@awdlab/jig/utils';

export function injectOrThrow<T>(token: ProviderToken<T>, moduleName: string, errorMsg: string): T {
  return inject(token, { optional: true }) ?? throwExp(moduleName, errorMsg);
}
