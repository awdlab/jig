---
"@ngneers/controls": next
---

<!-- author: Janik Schumacher -->
<!-- email: 37637338+LoaderB0T@users.noreply.github.com -->
<!-- timestamp: 2026-08-07T23:54:25.000Z -->

Angular peer dependencies are published as `^22.0.5` instead of the exact `22.0.5`. The peers are declared as `catalog:`, and the catalog pins exact versions to keep workspace installs reproducible — that pin was being copied verbatim into the published package, so every consumer on any later Angular patch hit a peer conflict and `ng update` refused to run without `--force`. Only bare versions are widened; ranges already written as `~` or `^` are left as-is.
