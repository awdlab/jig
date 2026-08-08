# @ngneers/controls-playwright

Playwright testing harness for **[@ngneers/controls](https://ngneers.dev)**.

Provides page-object–style `Ngn*Harness` helpers that wrap the components' DOM and ARIA
surface, so you can write readable end-to-end assertions against `@ngneers/controls`
without hand-rolling locators for every control.

```ts
import { NgnSelectHarness } from '@ngneers/controls-playwright';

const select = new NgnSelectHarness(page.locator('ngn-select'));
await select.open();
await select.clickItemByText('Option 2');
await select.expectSelectedItemText('Option 2');
```

Full guide: [Testing](https://ngneers.dev/guides/testing).

## License

MIT © NGneers
