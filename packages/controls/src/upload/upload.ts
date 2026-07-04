import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgnBase, NgnPt, provideSelf } from '@ngneers/controls/base';
import { NgnButton } from '@ngneers/controls/button';
import { I18n } from '@ngneers/controls/i18n';
import { NgnIcon } from '@ngneers/controls/icon';
import { NgnProgress } from '@ngneers/controls/progress';
import { uploadControlTemplate } from '@ngneers/controls-themes/templates/upload';

import type { NgnUploadFile } from './types';

/** How the user is allowed to add files to the drop zone. */
export type NgnUploadInteraction = 'click' | 'drag' | 'both';
/**
 * When selected/dropped files start uploading.
 * - `auto` — instantly.
 * - `confirm` — queued as `pending`; the user presses a rendered trigger.
 * - `manual` — queued as `pending`; no trigger is rendered, upload starts only
 *   via {@link NgnUpload.uploadAll}/{@link NgnUpload.uploadFile} from code.
 */
export type NgnUploadMode = 'auto' | 'confirm' | 'manual';
/** Which trigger(s) are rendered in `confirm` mode. */
export type NgnUploadConfirmTrigger = 'all' | 'per-item' | 'both';
/** Where the file list renders relative to the drop zone. */
export type NgnUploadListPosition = 'top' | 'bottom' | 'left' | 'right';

let uploadFileIdSeq = 0;

/**
 * A file drop zone that wraps a **consumer-provided** native `input[type=file]`.
 * Project the input as content and configure its native features there
 * (`accept`, `multiple`, `name`, size limits, …) — the control discovers it,
 * hides it, and drives it:
 *
 * ```html
 * <ngn-upload #up="ngnUpload" mode="auto" (upload)="send($event, up)">
 *   <input type="file" multiple accept="image/*" />
 * </ngn-upload>
 * ```
 *
 * The control owns the list of {@link NgnUploadFile}s and their lifecycle
 * state, but it **cannot** observe the actual transfer (the consumer runs the
 * request). Report progress/status back through the `exportAs="ngnUpload"`
 * handle: {@link setProgress}, {@link markDone}, {@link markFailed}.
 *
 * @category control
 */
@Component({
  selector: 'ngn-upload',
  exportAs: 'ngnUpload',
  templateUrl: './upload.html',
  imports: [NgnPt, NgnIcon, NgnButton, NgnProgress],
  providers: [provideSelf(NgnUpload)],
  host: {
    '(dragenter)': 'onDragOver($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class NgnUpload extends NgnBase<'upload'> {
  protected readonly theme = this.injectThemeTemplate(uploadControlTemplate, {
    root: true,
    dragover: () => this.dragover(),
    disabled: () => this.disabled(),
    clickable: () => this.clickable(),
    draggable: () => this.draggable(),
    'has-files': () => this.files().length > 0,
    'list-top': () => this.listPosition() === 'top',
    'list-bottom': () => this.listPosition() === 'bottom',
    'list-left': () => this.listPosition() === 'left',
    'list-right': () => this.listPosition() === 'right',
  });

  protected readonly i18n = inject(I18n).translations;

  /**
   * How the user may add files.
   * - `click` — only clicking the zone opens the picker.
   * - `drag` — only dropping files works.
   * - `both` — either (default).
   */
  public readonly interaction = input<NgnUploadInteraction>('both');
  /**
   * When uploads start: `auto` (instantly), `confirm` (user presses a rendered
   * trigger), or `manual` (only via {@link uploadAll}/{@link uploadFile}).
   */
  public readonly mode = input<NgnUploadMode>('auto');
  /**
   * In `confirm` mode, which trigger(s) to render: a single "upload all" button
   * (`all`, default), a button per pending item (`per-item`), or `both`.
   */
  public readonly confirmTrigger = input<NgnUploadConfirmTrigger>('all');
  /** Disables all interaction. */
  public readonly disabled = input(false, { transform: booleanAttribute });
  /** Where the file list renders relative to the drop zone. */
  public readonly listPosition = input<NgnUploadListPosition>('bottom');

  /**
   * Emitted with the files to upload: on select/drop in `auto` mode, or when a
   * manual trigger fires. The emitted items are already marked `uploading`.
   */
  public readonly upload = output<NgnUploadFile[]>();
  /** Emitted when a file is removed from the list. */
  public readonly remove = output<NgnUploadFile>();
  /** Emitted when a `failed` file's retry is pressed (also re-emits `upload`). */
  public readonly retry = output<NgnUploadFile>();
  /** Emitted when an in-flight file's cancel is pressed. Abort the request. */
  public readonly cancelUpload = output<NgnUploadFile>();

  /** The tracked files, in insertion order. */
  public readonly files = signal<NgnUploadFile[]>([]);

  protected readonly dragover = signal(false);

  protected readonly clickable = computed(
    () => this.interaction() === 'click' || this.interaction() === 'both'
  );
  protected readonly draggable = computed(
    () => this.interaction() === 'drag' || this.interaction() === 'both'
  );

  protected readonly hasPending = computed(() => this.files().some(f => f.state === 'pending'));
  protected readonly showUploadAll = computed(
    () =>
      this.mode() === 'confirm' &&
      (this.confirmTrigger() === 'all' || this.confirmTrigger() === 'both') &&
      this.hasPending()
  );
  protected readonly showPerItem = computed(
    () =>
      this.mode() === 'confirm' &&
      (this.confirmTrigger() === 'per-item' || this.confirmTrigger() === 'both')
  );

  private readonly _nativeInput = signal<HTMLInputElement | null>(null);

  /** Resolvers awaiting a file (by id) reaching a terminal/settled state. */
  private readonly _settlers = new Map<string, Array<() => void>>();

  constructor() {
    super();

    // Never leave an awaited upload promise dangling if we're torn down mid-flight.
    inject(DestroyRef).onDestroy(() => {
      for (const [id] of this._settlers) {
        this.settle(id);
      }
    });

    afterNextRender(() => {
      const input = this.element.nativeElement.querySelector<HTMLInputElement>('input[type=file]');
      if (!input) {
        return;
      }
      input.classList.add(this.theme.class('native'));
      input.addEventListener('change', () => this.onNativeChange(input));
      this._nativeInput.set(input);
    });

    // The zone itself is the interactive, focusable control (see the template's
    // role="button" / tabindex). Keep the projected input out of the tab order
    // and a11y tree so there's a single, visible focus stop on the zone.
    effect(() => {
      const input = this._nativeInput();
      if (!input) {
        return;
      }
      input.disabled = this.disabled();
      input.tabIndex = -1;
      input.setAttribute('aria-hidden', 'true');
    });
  }

  // --- Public handle (exportAs="ngnUpload") ----------------------------------

  /** Report transfer progress (`0`–`100`) for a file; marks it `uploading`. */
  public setProgress(id: string, progress: number): void {
    this.patch(id, { state: 'uploading', progress: clampPercent(progress) });
  }

  /** Mark a file as actively uploading. */
  public markUploading(id: string): void {
    this.patch(id, { state: 'uploading' });
  }

  /** Mark a file as successfully uploaded. */
  public markDone(id: string): void {
    this.patch(id, { state: 'done', progress: 100 });
  }

  /** Mark a file as failed, optionally attaching an error. */
  public markFailed(id: string, error?: unknown): void {
    this.patch(id, { state: 'failed', error });
  }

  // --- Interaction -----------------------------------------------------------

  protected onZoneClick(): void {
    this.openPicker();
  }

  protected onZoneKeydown(event: KeyboardEvent): void {
    // The zone is a role="button"; activate it with Enter/Space like a button.
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.openPicker();
    }
  }

  /** Open the native file picker, honouring the click/disabled gates. */
  private openPicker(): void {
    const input = this._nativeInput();
    if (this.clickable() && !this.disabled() && input) {
      input.click();
    }
  }

  protected onDragOver(event: DragEvent): void {
    if (!this.draggable() || this.disabled()) {
      return;
    }
    event.preventDefault();
    this.dragover.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    // Ignore leaves bubbling from children still inside the zone.
    if (event.relatedTarget && this.element.nativeElement.contains(event.relatedTarget as Node)) {
      return;
    }
    this.dragover.set(false);
  }

  protected onDrop(event: DragEvent): void {
    if (!this.draggable() || this.disabled()) {
      return;
    }
    event.preventDefault();
    this.dragover.set(false);
    const dropped = event.dataTransfer?.files;
    if (dropped?.length) {
      this.ingest(Array.from(dropped), true);
    }
  }

  private onNativeChange(input: HTMLInputElement): void {
    if (input.files?.length) {
      // Native input already enforced accept/multiple; ingest as-is.
      this.ingest(Array.from(input.files), false);
    }
    // Reset so selecting the same file again re-triggers `change`.
    input.value = '';
  }

  // --- Upload triggers -------------------------------------------------------

  /**
   * Start uploading every `pending` file. This is the code-driven trigger for
   * `manual` mode, and what the "upload all" button calls in `confirm` mode.
   *
   * Returns a promise that resolves once every started file has settled — i.e.
   * reached `done`, `failed`, or been cancelled/removed. It resolves with the
   * same items handed to `(upload)`, so their final {@link NgnUploadFile.state}
   * tells you which succeeded and which failed. Resolves with `[]` if there was
   * nothing pending.
   */
  public uploadAll(): Promise<NgnUploadFile[]> {
    const pending = this.files().filter(f => f.state === 'pending');
    return pending.length ? this.startUpload(pending) : Promise.resolve([]);
  }

  /**
   * Start uploading a single `pending` file by its {@link NgnUploadFile.id}.
   * Returns the same settle-promise as {@link uploadAll}.
   */
  public uploadFile(id: string): Promise<NgnUploadFile[]> {
    const item = this.files().find(f => f.id === id && f.state === 'pending');
    return item ? this.startUpload([item]) : Promise.resolve([]);
  }

  protected uploadOne(item: NgnUploadFile): void {
    void this.startUpload([item]);
  }

  protected retryFile(item: NgnUploadFile): void {
    this.retry.emit(item);
    void this.startUpload([item]);
  }

  protected cancelFile(item: NgnUploadFile): void {
    this.cancelUpload.emit(item);
    this.patch(item.id, { state: 'pending', progress: 0 });
  }

  protected removeFile(item: NgnUploadFile): void {
    this.files.update(files => files.filter(f => f.id !== item.id));
    this.settle(item.id);
    this.remove.emit(item);
  }

  /** Human-readable file size for display in the list. */
  protected formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = bytes / 1024;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit++;
    }
    return `${size.toFixed(1)} ${units[unit]}`;
  }

  // --- Internals -------------------------------------------------------------

  /** Filter/trim dropped files to mirror the native input's own validation. */
  private ingest(files: File[], isDrop: boolean): void {
    const input = this._nativeInput();
    let accepted = files;

    if (isDrop && input) {
      if (input.accept.trim()) {
        accepted = accepted.filter(f => matchesAccept(f, input.accept));
      }
      if (!input.multiple) {
        accepted = accepted.slice(0, 1);
      }
    }

    if (!accepted.length) {
      return;
    }

    const added = accepted.map<NgnUploadFile>(file => ({
      id: `ngn-upload-${++uploadFileIdSeq}`,
      file,
      state: 'pending',
      progress: 0,
    }));
    this.files.update(current => [...current, ...added]);

    if (this.mode() === 'auto') {
      void this.startUpload(added);
    }
  }

  private startUpload(items: NgnUploadFile[]): Promise<NgnUploadFile[]> {
    for (const item of items) {
      item.state = 'uploading';
    }
    this.files.update(files => [...files]);
    this.upload.emit(items);
    return Promise.all(items.map(item => this.whenSettled(item.id))).then(() => items);
  }

  /** Resolve once the file (by id) leaves `uploading` — done/failed/cancelled. */
  private whenSettled(id: string): Promise<void> {
    return new Promise<void>(resolve => {
      const item = this.files().find(f => f.id === id);
      if (!item || item.state !== 'uploading') {
        resolve();
        return;
      }
      const waiting = this._settlers.get(id) ?? [];
      waiting.push(resolve);
      this._settlers.set(id, waiting);
    });
  }

  private settle(id: string): void {
    const waiting = this._settlers.get(id);
    if (waiting) {
      this._settlers.delete(id);
      for (const resolve of waiting) {
        resolve();
      }
    }
  }

  private patch(id: string, changes: Partial<NgnUploadFile>): void {
    this.files.update(files => {
      const item = files.find(f => f.id === id);
      if (item) {
        Object.assign(item, changes);
      }
      return [...files];
    });
    // Any transition out of `uploading` settles a pending upload promise.
    if (changes.state && changes.state !== 'uploading') {
      this.settle(id);
    }
  }
}

function clampPercent(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}

/** Match a file against an `accept` attribute (`.ext`, `type/sub`, `type/*`). */
function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map(token => token.trim().toLowerCase())
    .filter(Boolean);
  if (!tokens.length) {
    return true;
  }
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some(token => {
    if (token.startsWith('.')) {
      return name.endsWith(token);
    }
    if (token.endsWith('/*')) {
      return type.startsWith(token.slice(0, -1));
    }
    return type === token;
  });
}
