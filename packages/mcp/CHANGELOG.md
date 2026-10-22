# Changelog

Release times are Central European Time (CET/CEST), the project's local time zone.

## @awdlab/jig-mcp 0.0.3 (2026-10-21 19:25 CEST)

### Changed

- Guidance update: `invalid` is set automatically by every form binding — signal, reactive and template-driven — and only needs binding for validity from outside Angular forms.

## @awdlab/jig-mcp 0.0.2 (2026-10-21 07:45 CEST)

### Changed

- Picks up `@modelcontextprotocol/sdk` `^1.32.1` and `zod` `^4.6.7`. No source changes.

## @awdlab/jig-mcp 0.0.1 (2026-08-27 12:02 CEST)

First stable release.

### Fixed

- The stdio JSON-RPC channel no longer breaks on startup. `init.js` was imported eagerly and pulls in `awesome-logging`, which writes escape sequences to stdout and hijacks stdin on import; it is now loaded lazily, only for the `init` command.

### Added

- The knowledge pack covers every public directive, including the table's structure directives.

## @awdlab/jig-mcp 0.0.1-next.1 (2026-08-07 22:32 CEST)

### Added

- Migration maps cover the newer controls: `p-rating`, `p-colorPicker` and `mat-stepper` map to `jig-rating`, `jig-color-picker` and `jig-stepper`/`jig-step`; `p-inputOtp`, `p-stepper`, `p-scroller`, `ejs-rating`, `ejs-stepper`, `ejs-colorpicker`, `ejs-otpinput`, `ejs-inplaceeditor` and `ejs-keyboard` are new entries.

### Changed

- Badges map to the `[jigBadge]` directive instead of `jig-tag`.
- The table recipe documents `dataSource` lazy loading; the form recipe documents `[jigErrors]` with signal forms.
- 65 controls in the pack, up from 62.

## @awdlab/jig-mcp 0.0.1-next.0 (2026-07-17 01:31 CEST)

- First prerelease: release readiness set up.
