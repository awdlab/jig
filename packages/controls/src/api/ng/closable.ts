export type { Openable } from '@awdlab/jig/utils-ng';

export type PopoverCloseBy = 'any' | 'none';
export type CloseBy = PopoverCloseBy | 'escape';

export function toPopoverCloseBy(closeBy: CloseBy): 'auto' | 'manual' {
  switch (closeBy) {
    case 'any':
      return 'auto';
    case 'escape':
    case 'none':
      return 'manual';
  }
}

export function toModalCloseBy(closeBy: CloseBy): 'any' | 'closerequest' | 'none' {
  switch (closeBy) {
    case 'any':
      return 'any';
    case 'escape':
      return 'closerequest';
    case 'none':
      return 'none';
  }
}
