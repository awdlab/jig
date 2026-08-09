<div align="center">

<img src="https://raw.githubusercontent.com/awdlab/jig/main/apps/docs/public/img/logo-mark.png" alt="" width="88" />

# @awdlab/jig-playwright

**Playwright testing harness for
[@awdlab/jig](https://www.npmjs.com/package/@awdlab/jig).**

[![Main package](https://img.shields.io/badge/Main%20package-%40awdlab%2Fjig-e90464?style=for-the-badge)](https://www.npmjs.com/package/@awdlab/jig)
[![Testing guide](https://img.shields.io/badge/Testing%20guide-jig.awdlab.dev-8514f5?style=for-the-badge)](https://jig.awdlab.dev/guides/testing)

</div>

Page-object–style `Jig*Harness` helpers that wrap the controls' DOM and ARIA surface, so
end-to-end assertions read like the user's intent instead of hand-rolled locators.

## Install

```bash
pnpm add -D @awdlab/jig-playwright
```

```ts
import { JigSelectHarness } from '@awdlab/jig-playwright';

const select = new JigSelectHarness(page.locator('jig-select'));
await select.open();
await select.clickItemByText('Option 2');
await select.expectSelectedItemText('Option 2');
```

## Documentation

Setup and the full harness reference are documented with the main package:
**[jig.awdlab.dev/guides/testing](https://jig.awdlab.dev/guides/testing)**

## License

MIT © awdlab
