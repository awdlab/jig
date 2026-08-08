<div align="center">

<img src="https://raw.githubusercontent.com/NGneers/controls/main/apps/docs/public/img/logo-mark.png" alt="" width="88" />

# @ngneers/controls-playwright

**Playwright testing harness for
[@ngneers/controls](https://www.npmjs.com/package/@ngneers/controls).**

[![Main package](https://img.shields.io/badge/Main%20package-%40ngneers%2Fcontrols-e90464?style=for-the-badge)](https://www.npmjs.com/package/@ngneers/controls)
[![Testing guide](https://img.shields.io/badge/Testing%20guide-ngneers.dev-8514f5?style=for-the-badge)](https://ngneers.dev/guides/testing)

</div>

Page-object–style `Ngn*Harness` helpers that wrap the controls' DOM and ARIA surface, so
end-to-end assertions read like the user's intent instead of hand-rolled locators.

## Install

```bash
pnpm add -D @ngneers/controls-playwright
```

```ts
import { NgnSelectHarness } from '@ngneers/controls-playwright';

const select = new NgnSelectHarness(page.locator('ngn-select'));
await select.open();
await select.clickItemByText('Option 2');
await select.expectSelectedItemText('Option 2');
```

## Documentation

Setup and the full harness reference are documented with the main package:
**[ngneers.dev/guides/testing](https://ngneers.dev/guides/testing)**

## License

MIT © NGneers
