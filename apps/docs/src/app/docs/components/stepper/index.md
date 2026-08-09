The Stepper (`jig-stepper`) guides the user through an ordered sequence of steps,
showing one step's content at a time under a clickable header. Declare each step
with `jig-step` and project its body via `<ng-template #content>`. Bind `active`
for the current index; the app drives navigation (e.g. Back/Next buttons or
header clicks).

### Basic Usage

{{ demo: Demo_Stepper_Base }}

### Linear

Set `linear` to require earlier steps be `completed` before later ones can be
reached. The app sets each step's `completed`.

{{ demo: Demo_Stepper_Linear }}
