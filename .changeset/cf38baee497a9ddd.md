---
"@ngneers/controls": next
---

<!-- author: Janik Schumacher -->
<!-- email: 37637338+LoaderB0T@users.noreply.github.com -->
<!-- timestamp: 2026-08-07T12:56:30.328Z -->

A control that renders already open no longer hides its own content from the browser. Every control starts out with `ngn-control-initializing` (`display: none`) to avoid a flash of unstyled content, and dropped that class in the same after-render phase that `ngn-dialog` uses to call `showModal()` — so a dialog created with `open` set to `true` ran its native focusing steps while the controls inside it were still hidden. Anything carrying `autofocus` was skipped as unfocusable and focus fell through to the header close button. The class now lifts in the earlier `write` phase, ahead of any `mixedReadWrite` hook.

`[ngnMovable]` and `[ngnResizable]` now end an interaction on `pointercancel`, not just `pointerup`. Touch scrolling takes the pointer away and only fires `pointercancel`, which left both directives believing a drag or resize was still running — on the command palette that baked the dialog's position and size in place the next time the filter changed its height. `[ngnResizable]` also stops observing size and ignores pointer presses while its binding is falsy.
