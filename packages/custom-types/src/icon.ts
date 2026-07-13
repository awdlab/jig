import type { NgnCustomTypes } from './custom-types';

import type { IconifyIcon } from '@iconify/types';

export interface NgnIconEntry {
  icon: IconifyIcon;
  scale?: number;
}

export type IconType = NgnCustomTypes extends { icon: infer T } ? T : IconifyIcon | NgnIconEntry;
