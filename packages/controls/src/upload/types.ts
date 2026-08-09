/**
 * The lifecycle state of a single {@link JigUploadFile}.
 *
 * - `pending` — queued, not yet handed to the consumer (manual mode, or pre-emit).
 * - `uploading` — emitted via `(upload)`, the consumer is transferring it.
 * - `done` — the consumer reported success via `markDone`.
 * - `failed` — the consumer reported an error via `markFailed`.
 * - `cancelled` — dismissed while in-flight; the item is removed from the list
 *   but settles the upload promise in this terminal state.
 */
export type JigUploadFileState = 'pending' | 'uploading' | 'done' | 'failed' | 'cancelled';

/**
 * A file tracked by {@link JigUpload}. Wraps the native {@link File} with the
 * control-owned {@link id} (used to report progress/status back through the
 * `exportAs` handle) and the current lifecycle {@link state}.
 *
 * The control cannot observe the real upload — the consumer runs the request —
 * so {@link progress} is only meaningful once the consumer wires it back via
 * `setProgress`. It stays `0` (rendered as an indeterminate bar while
 * `uploading`) until then.
 */
export interface JigUploadFile {
  /** Stable, control-generated id. Use it to call back through the handle. */
  readonly id: string;
  /** The native file selected or dropped by the user. */
  readonly file: File;
  /** Current lifecycle state. */
  state: JigUploadFileState;
  /** Upload progress in the range `0`–`100`. `0` renders as indeterminate. */
  progress: number;
  /** Error reported by the consumer for a `failed` file, if any. */
  error?: unknown;
}
