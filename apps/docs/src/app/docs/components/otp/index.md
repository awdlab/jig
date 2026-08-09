The OTP control (`jig-otp`) collects a short verification / one-time-password
code across a row of single-character cells. It is a self-contained value
control — bind `[(value)]` directly on `<jig-otp>`. The value is the composed
string (`null` while every cell is empty), and the `(completed)` output fires
once the whole code is filled.

Typing a character fills the active cell and advances focus; pasting a code
distributes its characters across the cells automatically.

{{ demo: Demo_Otp_Base }}

### Masked entry

Set `mask` to render each entered character as a dot instead of the character
itself — useful for PINs and other secret codes. Combine with `integerOnly` to
restrict entry to digits and switch touch keyboards to numeric.

{{ demo: Demo_Otp_Mask }}

### Length

`length` controls how many cells are rendered (default `6`). Leave
`integerOnly` off to accept any character, e.g. alphanumeric backup codes.

{{ demo: Demo_Otp_Length }}

### Validation

Being a value control, `jig-otp` supports the shared `invalid` state. Here the
field turns invalid once a complete-but-wrong code is entered, and confirms once
the expected code is typed.

{{ demo: Demo_Otp_Validation }}
