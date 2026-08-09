import type { AwdCustomTypes } from './custom-types';

import type { IconifyIcon } from '@iconify/types';

export interface AwdIconEntry {
  icon: IconifyIcon;
  scale?: number;
}

export type IconType = AwdCustomTypes extends { icon: infer T } ? T : IconifyIcon | AwdIconEntry;
