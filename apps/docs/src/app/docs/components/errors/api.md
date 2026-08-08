Selector: `[ngnErrors]` · `exportAs: ngnErrors`

{{ api: errors/errors NgnErrors }}

## Providers

| Function                             | Description                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `provideNgnErrorsMessages(messages)` | Registers a message map application- or feature-wide. `multi`, so several maps merge. |
| `injectNgnErrorsMessages()`          | Returns all provided maps merged into one object. For building your own error UI.     |
| `NGN_ERRORS_MESSAGES`                | The underlying multi-provider token.                                                  |

## Types

### NgnError

The normalized shape of one resolved error.

| Field     | Type                      | Description                                         |
| --------- | ------------------------- | --------------------------------------------------- |
| `key`     | `string`                  | Validation error key, e.g. `required`.              |
| `value`   | `unknown`                 | The raw error value Angular reported.               |
| `source`  | `NgnErrorsSource`         | `'control'`, `'group'` or `'custom'`.               |
| `message` | `string`                  | The resolved, display-ready message.                |
| `params`  | `Record<string, unknown>` | Interpolation params, derived from the error value. |

### NgnErrorsState

What `state()` returns, and what is pushed into the bound hint.

| Field        | Type                  | Description                                        |
| ------------ | --------------------- | -------------------------------------------------- |
| `visible`    | `boolean`             | Whether messages should currently show.            |
| `pending`    | `boolean`             | An async validator is running.                     |
| `errors`     | `readonly NgnError[]` | All resolved errors.                               |
| `firstError` | `NgnError \| null`    | The first one, or `null`.                          |
| `message`    | `string \| null`      | The message to display, honouring `ngnErrorsMode`. |

### Other types

| Type                      | Shape                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| `NgnErrorsShowOn`         | `'touched' \| 'dirty' \| 'submitted' \| 'always' \| 'never'`                  |
| `NgnErrorsMode`           | `'first' \| 'all'`                                                            |
| `NgnErrorsSource`         | `'control' \| 'group' \| 'custom'`                                            |
| `NgnErrorsMessage`        | `string \| ((error: NgnErrorsMessageContext) => string \| null \| undefined)` |
| `NgnErrorsMessages`       | `Record<string, NgnErrorsMessage>`                                            |
| `NgnErrorsCustom`         | `ValidationErrors \| readonly (string \| NgnErrorsCustomEntry)[] \| null`     |
| `NgnErrorsCustomEntry`    | `{ key: string; value?: unknown; message?: string; params?: object }`         |
| `NgnErrorsMessageContext` | `{ key: string; value: unknown; source: NgnErrorsSource; params: object }`    |
