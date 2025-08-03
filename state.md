# State of ngneers-controls

## Docs

- Landing Page
- ✅Controls Examples
- Nicely formatted code examples for each control
  - With live preview?
- API Documentation (generated from tsdoc?)
- ✅Navigation between controls
- Sidebar navigation between control examples
- Written documentation for each example
- ✅Auto route generation for each control

## Quality

- Unit Tests
- e2e Tests (playwright)
- CI / CD
- Visual Regression Tests!

## Theming

- light
- dark
- contrast
- Remove variables from themeparts (only primitives & semantics)
- Palette generator function
- RTL support

## Controls

- Kind with custom types

### Value Controls

- Readonly Mode?
- Value & change event without ngModel

### Checkbox

- True/False
- Indeterminate
- Theming
- Disabled
- Invalid

### Input Field

- Regular Label
- FloatLabel
  - On
  - In
  - Over
  - +Forced
- Icons
- Buttons

### Input Group

Out of scope for 0.1

### Input Mask

- Mask
- Complex & Simple Cfg

### Input Number

- Directive?
- Min/Max fractions
- Localization
- Hide arrows

### Input OTP

Out of scope for 0.1

### TextField

- ✅Input
- ✅Mask
- Mask a11y
- X to clear value
- 🕑Theme
- a11y

### Listbox

- ✅Grouping
- Async Filtering
- ✅Item Templates
- ✅Group Templates
- ✅Virtual Scrolling
- Lazy Loading
- 🕑Theme -> Fix css to use all possible variables
- ✅Keyboard selection
- SVG icons
- a11y
- prevent textwrap -> tooltip

### Select

- ✅Grouping
- ✅Async Filtering
- ✅Item Templates
- ✅Group Templates
- ✅Selected Item Templates
- ✅Virtual Scrolling
- Lazy Loading
- ✅Theme
- Editable (Custom Value)
- ✅Keyboard selection
- SVG icons
- a11y
- multiselect
- multiselect overflow -> x items selected
- Invalid
- Disabled

### Icons

- ✅Global Template
- a11y

### Radio Button

### Select Button

### Slider

### Textarea

### Togglebutton

### ToggleSwitch

### Treeselect

### Buttongroup

### Dropdown button

### Treeview

### Accordion

### Tabs

### Dialog Service

### Drawer

### Upload

### Breadcrumb

### Menu

- Tiered

### Message

### Toast Service

### Avatar

### Chip

### Inplace Edit

### Progress Bar

- Linear
- Circular

### Progress Bar Service

### Tag

### Scroller

- ✅Virtual Scrolling
- ✅Item Template
- ✅Sticky Items
- ✅Scroll to index
- ❓Horizontal Scrolling

### Popover

- ✅Positioning
- ✅Size Constraints
- ✅Height: fit-content
- ✅Theme
- Arrow
- a11y

### Dialog

- ✅Show & hide
- Positioning
- Size Constraints
- a11y
- Theme

### Calendar

- ✅Days View
- ✅Months View
- Years View / Quick way to select year
- ✅Day Templates
- ✅Month Templates
- Calendar Week toggle
- Time
- Time Templates
- a11y
- Theme
- Popover/Input
- i18n

## Splitter

- ✅Resize Panels
- ✅Reorder Panels
- ✅State Persistence
- ✅Min/Max Sizes for Panels
  - ✅during panel resize
  - ✅during page/container resize and initial values
- ✅Theme
- Recursive resizing (push panel and resize other if min/max limits are reached)
- ✅Keyboard interaction
- ✅a11y

## Tooltip

- ✅Basic Tooltip
- Animations
- Show delay
- Positioning left-start, left-end, right-start, right-end not working
- Option to add a pointer to the tooltip
- Theme
- (?) Add option to show tooltip on focus
- Add option to show tooltip only when content is truncated
- a11y
