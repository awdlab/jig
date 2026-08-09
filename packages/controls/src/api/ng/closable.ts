import { type ModelSignal, OutputEmitterRef } from '@angular/core';

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

export interface Openable {
  show(): void;
  hide(): void;
  toggle(): void;
  open: ModelSignal<boolean>;
  closed: OutputEmitterRef<void>;
}
