Selector: `[jigErrors]` · `exportAs: jigErrors`

{{ api: errors/errors JigErrors }}

## Providers

| Function                             | Description                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `provideJigErrorsMessages(messages)` | Registers a message map application- or feature-wide. `multi`, so several maps merge. |
| `injectJigErrorsMessages()`          | Returns all provided maps merged into one object. For building your own error UI.     |
| `JIG_ERRORS_MESSAGES`                | The underlying multi-provider token.                                                  |

## Types

### JigError

The normalized shape of one resolved error.

| Field     | Type                      | Description                                         |
| --------- | ------------------------- | --------------------------------------------------- |
| `key`     | `string`                  | Validation error key, e.g. `required`.              |
| `value`   | `unknown`                 | The raw error value Angular reported.               |
| `source`  | `JigErrorsSource`         | `'control'`, `'group'` or `'custom'`.               |
| `message` | `string`                  | The resolved, display-ready message.                |
| `params`  | `Record<string, unknown>` | Interpolation params, derived from the error value. |

### JigErrorsState

What `state()` returns, and what is pushed into the bound hint.

| Field        | Type                  | Description                                        |
| ------------ | --------------------- | -------------------------------------------------- |
| `visible`    | `boolean`             | Whether messages should currently show.            |
| `pending`    | `boolean`             | An async validator is running.                     |
| `errors`     | `readonly JigError[]` | All resolved errors.                               |
| `firstError` | `JigError \| null`    | The first one, or `null`.                          |
| `message`    | `string \| null`      | The message to display, honouring `jigErrorsMode`. |

### Other types

| Type                      | Shape                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| `JigErrorsShowOn`         | `'touched' \| 'dirty' \| 'submitted' \| 'always' \| 'never'`                  |
| `JigErrorsMode`           | `'first' \| 'all'`                                                            |
| `JigErrorsSource`         | `'control' \| 'group' \| 'custom'`                                            |
| `JigErrorsMessage`        | `string \| ((error: JigErrorsMessageContext) => string \| null \| undefined)` |
| `JigErrorsMessages`       | `Record<string, JigErrorsMessage>`                                            |
| `JigErrorsCustom`         | `ValidationErrors \| readonly (string \| JigErrorsCustomEntry)[] \| null`     |
| `JigErrorsCustomEntry`    | `{ key: string; value?: unknown; message?: string; params?: object }`         |
| `JigErrorsMessageContext` | `{ key: string; value: unknown; source: JigErrorsSource; params: object }`    |
