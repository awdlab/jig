import { Provider } from '@angular/core';

import { NgnToastManager } from './toast-manager';

export type NgnToastFeature = {
  providers: Provider[];
};
export function withToasts(): NgnToastFeature {
  return {
    providers: [NgnToastManager],
  };
}
