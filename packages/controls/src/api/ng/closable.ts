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

/**
 * The shared surface of every overlay control that has an open/close state.
 *
 * `open` is the source of truth a consumer binds to; the control keeps it in step with
 * what the user does. The two outputs bracket the exit animation: {@link Openable.closing}
 * fires the moment the close starts, {@link Openable.closed} once the animation has
 * finished and the overlay is fully torn down.
 *
 * Controls whose visibility is derived rather than bound — tooltips, toast and snackbar
 * regions — deliberately stay outside this contract.
 */
export interface Openable {
  /** Opens the overlay. Equivalent to setting {@link Openable.open} to `true`. */
  show(): void;
  /** Closes the overlay. Equivalent to setting {@link Openable.open} to `false`. */
  hide(): void;
  /** Opens or closes, whichever the overlay is not. */
  toggle(): void;
  /** Two-way open state. */
  open: ModelSignal<boolean>;
  /** Emitted once the overlay has fully closed, after its exit animation. */
  closed: OutputEmitterRef<void>;
  /** Emitted when the close starts. Optional — not every overlay reports it. */
  closing?: OutputEmitterRef<void>;
}
