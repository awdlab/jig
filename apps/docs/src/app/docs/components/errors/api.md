Selector: `[ngnErrors]` · `exportAs: ngnErrors`

{{ api: errors/errors AwdErrors }}

## Providers

| Function                             | Description                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `provideAwdErrorsMessages(messages)` | Registers a message map application- or feature-wide. `multi`, so several maps merge. |
| `injectAwdErrorsMessages()`          | Returns all provided maps merged into one object. For building your own error UI.     |
| `NGN_ERRORS_MESSAGES`                | The underlying multi-provider token.                                                  |

## Types

### AwdError

The normalized shape of one resolved error.

| Field     | Type                      | Description                                         |
| --------- | ------------------------- | --------------------------------------------------- |
| `key`     | `string`                  | Validation error key, e.g. `required`.              |
| `value`   | `unknown`                 | The raw error value Angular reported.               |
| `source`  | `AwdErrorsSource`         | `'control'`, `'group'` or `'custom'`.               |
| `message` | `string`                  | The resolved, display-ready message.                |
| `params`  | `Record<string, unknown>` | Interpolation params, derived from the error value. |

### AwdErrorsState

What `state()` returns, and what is pushed into the bound hint.

| Field        | Type                  | Description                                        |
| ------------ | --------------------- | -------------------------------------------------- |
| `visible`    | `boolean`             | Whether messages should currently show.            |
| `pending`    | `boolean`             | An async validator is running.                     |
| `errors`     | `readonly AwdError[]` | All resolved errors.                               |
| `firstError` | `AwdError \| null`    | The first one, or `null`.                          |
| `message`    | `string \| null`      | The message to display, honouring `ngnErrorsMode`. |

### Other types

| Type                      | Shape                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| `AwdErrorsShowOn`         | `'touched' \| 'dirty' \| 'submitted' \| 'always' \| 'never'`                  |
| `AwdErrorsMode`           | `'first' \| 'all'`                                                            |
| `AwdErrorsSource`         | `'control' \| 'group' \| 'custom'`                                            |
| `AwdErrorsMessage`        | `string \| ((error: AwdErrorsMessageContext) => string \| null \| undefined)` |
| `AwdErrorsMessages`       | `Record<string, AwdErrorsMessage>`                                            |
| `AwdErrorsCustom`         | `ValidationErrors \| readonly (string \| AwdErrorsCustomEntry)[] \| null`     |
| `AwdErrorsCustomEntry`    | `{ key: string; value?: unknown; message?: string; params?: object }`         |
| `AwdErrorsMessageContext` | `{ key: string; value: unknown; source: AwdErrorsSource; params: object }`    |
