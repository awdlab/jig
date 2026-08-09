import type { JigCustomTypes } from './custom-types';

import type { IconifyIcon } from '@iconify/types';

export interface JigIconEntry {
  icon: IconifyIcon;
  scale?: number;
}

export type IconType = JigCustomTypes extends { icon: infer T } ? T : IconifyIcon | JigIconEntry;
