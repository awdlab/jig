import {
  ApplicationRef,
  createEnvironmentInjector,
  EnvironmentInjector,
  Injector,
  type ModelSignal,
  runInInjectionContext,
  signal,
  type WritableSignal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  OverlayLifecycle,
  type OverlayLifecycleOptions,
  type OverlayMode,
} from './overlay-lifecycle';

/** Drives rAF synchronously so the close path can be asserted without waiting. */
function flushRaf(): void {
  const callbacks = rafQueue.splice(0);
  callbacks.forEach(callback => callback(performance.now()));
}

let rafQueue: FrameRequestCallback[] = [];

/** jsdom has no popover/dialog API — record the calls instead. */
function createElement(): HTMLElement & { calls: string[]; animations: Animation[] } {
  const element = document.createElement('div') as unknown as HTMLElement & {
    calls: string[];
    animations: Animation[];
  };
  element.calls = [];
  element.animations = [];
  Object.assign(element, {
    showPopover: () => element.calls.push('showPopover'),
    hidePopover: () => element.calls.push('hidePopover'),
    togglePopover: (force: boolean) => element.calls.push(`togglePopover(${force})`),
    showModal: () => element.calls.push('showModal'),
    close: () => element.calls.push('close'),
    getAnimations: () => element.animations,
  });
  document.body.appendChild(element);
  return element;
}

function animation(
  finished: Promise<unknown>,
  { iterations = 1, playState = 'running' }: { iterations?: number; playState?: string } = {}
): Animation {
  return {
    finished,
    playState,
    effect: { getComputedTiming: () => ({ iterations }) },
  } as unknown as Animation;
}

/**
 * A control's `open` is a `ModelSignal`, which only `model()` inside a component can
 * produce. The lifecycle reads and sets it like any writable signal, so a plain one
 * stands in.
 */
function openModel(initial = false): ModelSignal<boolean> & WritableSignal<boolean> {
  return signal(initial) as unknown as ModelSignal<boolean> & WritableSignal<boolean>;
}

function create(
  element: HTMLElement,
  mode: OverlayMode,
  options: Omit<OverlayLifecycleOptions, 'mode'> = {}
) {
  const injector = TestBed.inject(Injector);
  return runInInjectionContext(
    injector,
    () => new OverlayLifecycle(() => element, { mode: () => mode, ...options })
  );
}

describe('OverlayLifecycle', () => {
  beforeEach(() => {
    // jsdom implements none of the top-layer APIs. Per-element stubs record the calls
    // under test; these keep any element the suite does not stub from throwing.
    Object.assign(HTMLElement.prototype, {
      showPopover: () => undefined,
      hidePopover: () => undefined,
      togglePopover: () => undefined,
    });
    rafQueue = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafQueue.push(callback);
      return rafQueue.length;
    });
    document.body.innerHTML = '';
  });

  it('starts closed and opens on demand', () => {
    const element = createElement();
    const lifecycle = create(element, 'popover');

    expect(lifecycle.phase()).toBe('closed');
    expect(lifecycle.isFullyClosed()).toBe(true);

    lifecycle.show();

    expect(lifecycle.phase()).toBe('open');
    expect(lifecycle.isFullyClosed()).toBe(false);
  });

  describe('per-mode native calls', () => {
    const cases: { mode: OverlayMode; show: string; hide: string; attr: string | null }[] = [
      { mode: 'modal', show: 'showModal', hide: 'close', attr: null },
      { mode: 'popover', show: 'togglePopover(true)', hide: 'togglePopover(false)', attr: 'auto' },
      { mode: 'hint', show: 'togglePopover(true)', hide: 'togglePopover(false)', attr: 'hint' },
      { mode: 'manual', show: 'togglePopover(true)', hide: 'togglePopover(false)', attr: 'manual' },
    ];

    for (const { mode, show, hide, attr } of cases) {
      it(`${mode}: shows, hides and manages the attribute`, async () => {
        const element = createElement();
        const lifecycle = create(element, mode);

        lifecycle.show();
        expect(element.calls).toContain(show);
        expect(element.getAttribute('popover')).toBe(attr);

        lifecycle.hide();
        expect(element.calls).toContain(hide);

        flushRaf();
        await Promise.resolve();
        expect(lifecycle.phase()).toBe('closed');
        expect(element.getAttribute('popover')).toBeNull();
      });
    }
  });

  it('sets the popover attribute before the show call', () => {
    const element = createElement();
    let attributeAtShowTime: string | null = 'missing';
    Object.assign(element, {
      togglePopover: () => (attributeAtShowTime = element.getAttribute('popover')),
    });
    const lifecycle = create(element, 'popover');

    lifecycle.show();

    expect(attributeAtShowTime).toBe('auto');
  });

  it('lands closed even when the exit animation is cancelled', async () => {
    const element = createElement();
    element.animations = [animation(Promise.reject(new Error('cancelled')))];
    const lifecycle = create(element, 'popover');
    lifecycle.show();

    lifecycle.hide();
    expect(lifecycle.phase()).toBe('closing');

    flushRaf();
    await new Promise(resolve => setTimeout(resolve));

    expect(lifecycle.phase()).toBe('closed');
  });

  it('ignores infinite animations so a looping decoration cannot wedge the close', async () => {
    const element = createElement();
    element.animations = [animation(new Promise(() => undefined), { iterations: Infinity })];
    const lifecycle = create(element, 'popover');
    lifecycle.show();

    lifecycle.hide();
    flushRaf();
    await new Promise(resolve => setTimeout(resolve));

    expect(lifecycle.phase()).toBe('closed');
  });

  it('skips paused and idle animations, which would never settle', async () => {
    const element = createElement();
    element.animations = [
      animation(new Promise(() => undefined), { playState: 'paused' }),
      animation(new Promise(() => undefined), { playState: 'idle' }),
    ];
    const lifecycle = create(element, 'popover');
    lifecycle.show();

    lifecycle.hide();
    flushRaf();
    await new Promise(resolve => setTimeout(resolve));

    expect(lifecycle.phase()).toBe('closed');
  });

  it('waits for a running exit animation before reporting closed', async () => {
    const element = createElement();
    let settle!: () => void;
    element.animations = [animation(new Promise<void>(resolve => (settle = resolve)))];
    const lifecycle = create(element, 'popover');
    lifecycle.show();

    lifecycle.hide();
    flushRaf();
    await new Promise(resolve => setTimeout(resolve));
    expect(lifecycle.phase()).toBe('closing');

    settle();
    await new Promise(resolve => setTimeout(resolve));
    expect(lifecycle.phase()).toBe('closed');
  });

  it('discards a close that was reopened while its animation ran', async () => {
    const element = createElement();
    let settle!: () => void;
    element.animations = [animation(new Promise<void>(resolve => (settle = resolve)))];
    const onClosed = vi.fn();
    const lifecycle = create(element, 'popover', { onClosed });
    lifecycle.show();

    lifecycle.hide();
    flushRaf();
    lifecycle.show();

    settle();
    await new Promise(resolve => setTimeout(resolve));

    expect(lifecycle.phase()).toBe('open');
    expect(onClosed).not.toHaveBeenCalled();
  });

  it('follows a user-driven close through the native toggle event', async () => {
    const element = createElement();
    const onClosing = vi.fn();
    const lifecycle = create(element, 'popover', { onClosing });
    lifecycle.show();

    lifecycle.onNativeToggle({ newState: 'closed' } as ToggleEvent);

    expect(lifecycle.phase()).toBe('closing');
    expect(onClosing).toHaveBeenCalledOnce();
    // The element already left the top layer — no second hide call.
    expect(element.calls.filter(call => call === 'togglePopover(false)')).toHaveLength(0);

    flushRaf();
    await Promise.resolve();
    expect(lifecycle.phase()).toBe('closed');
  });

  it('follows the control open model without the control wiring an effect', async () => {
    const element = createElement();
    const open = openModel();
    TestBed.runInInjectionContext(
      () => new OverlayLifecycle(() => element, { mode: () => 'popover', control: { open } })
    );
    const tick = () => TestBed.inject(ApplicationRef).tick();

    tick();
    expect(element.calls).toHaveLength(0);

    open.set(true);
    tick();
    expect(element.calls).toContain('togglePopover(true)');

    open.set(false);
    tick();
    expect(element.calls).toContain('togglePopover(false)');
  });

  it('survives an imperative show while the model still reads false', () => {
    const element = createElement();
    const open = openModel();
    const lifecycle = TestBed.runInInjectionContext(
      () =>
        new OverlayLifecycle(() => element, {
          mode: () => 'popover',
          control: { open },
          // Deferred, so the model would otherwise stay false across a render.
          deferShow: true,
        })
    );

    lifecycle.show();
    // The model must already agree, or the effect following it closes this right back.
    expect(open()).toBe(true);
    TestBed.inject(ApplicationRef).tick();
    expect(lifecycle.phase()).toBe('opening');

    flushRaf();
    expect(element.calls).toContain('togglePopover(true)');
    expect(lifecycle.phase()).toBe('open');
  });

  it('deferHide keeps the overlay in the top layer until the animation finishes', async () => {
    const element = createElement();
    let settle!: () => void;
    element.animations = [animation(new Promise<void>(resolve => (settle = resolve)))];
    const lifecycle = create(element, 'manual', { deferHide: true, awaitSubtree: true });
    lifecycle.show();

    lifecycle.hide();
    flushRaf();
    await new Promise(resolve => setTimeout(resolve));
    // Still shown: a child is animating itself out and must stay visible for it.
    expect(element.calls).not.toContain('togglePopover(false)');

    settle();
    await new Promise(resolve => setTimeout(resolve));
    expect(element.calls).toContain('togglePopover(false)');
    expect(lifecycle.phase()).toBe('closed');
  });

  it('keeps the control open model in step with the phase', () => {
    const element = createElement();
    const open = openModel();
    const lifecycle = create(element, 'popover', { control: { open } });

    lifecycle.show();
    expect(open()).toBe(true);

    lifecycle.hide();
    expect(open()).toBe(false);
  });

  it('ignores repeated opens and closes', () => {
    const element = createElement();
    const onOpened = vi.fn();
    const lifecycle = create(element, 'popover', { onOpened });

    lifecycle.show();
    lifecycle.show();

    expect(onOpened).toHaveBeenCalledOnce();
    expect(element.calls.filter(call => call === 'togglePopover(true)')).toHaveLength(1);
  });

  it('stops notifying once the host is destroyed', async () => {
    const element = createElement();
    let settle!: () => void;
    element.animations = [animation(new Promise<void>(resolve => (settle = resolve)))];
    const onClosed = vi.fn();
    const injector = createEnvironmentInjector([], TestBed.inject(EnvironmentInjector));
    const lifecycle = new OverlayLifecycle(() => element, {
      mode: () => 'popover',
      onClosed,
      injector,
    });
    lifecycle.show();
    lifecycle.hide();
    flushRaf();

    // A menu item whose callback drops the menu destroys the host mid-close.
    injector.destroy();
    settle();
    await new Promise(resolve => setTimeout(resolve));

    expect(onClosed).not.toHaveBeenCalled();
  });

  it('no-ops on a detached element instead of throwing', () => {
    const element = createElement();
    element.remove();
    const lifecycle = create(element, 'popover');

    expect(() => lifecycle.show()).not.toThrow();
    expect(lifecycle.phase()).toBe('closed');
    expect(element.calls).toHaveLength(0);
  });

  it('rolls the model back when a detached element cannot be shown', () => {
    const element = createElement();
    element.remove();
    const open = openModel();
    const lifecycle = create(element, 'popover', { control: { open } });

    lifecycle.show();

    // Left `true`, the control would report itself open with nothing behind it, and the
    // next `show()` would no-op against a model that never went back to false.
    expect(open()).toBe(false);
    expect(lifecycle.phase()).toBe('closed');
  });
});
