# Changelog

## 0.0.2
### Features

#### toggle

- Added generic `CsToggle` directive.
    A toggle is the inverse of an `NgSwitch`. Wheras a switch chooses its content depending on the value passed to it,
    a toggle outputs a value depending on which of it's children are "activated" (for some definition of activate).

- Added generic `CsToggleOption` interface.
    The children of a toggle which conform to the toggleOption interface can be used to activate the value of
    the toggle.

- Added `CsSimpleToggleOption`.
    An implementation of `CsToggleOption` which takes it's value from the `href` attribute of an `<a>` element and is
    activated when the anchor element is clicked


#### phone

- Added `PhoneNumber` type, representing a locale formatted string of digits which is to be interpreted as a phone number.
  - PhoneNumber is a type alias for `string` and represents a formatted, localised phone number.
  - Exposes a display codec, validation function and localization service for dealing with phone numbers.

- Added angular pipe for displaying formatted phone numbers.

- Added `<cs-phone-input>` element, wraps `<input type=tel>`
  - Allows users to input phone numbers in a format determined by their locale.
  - Adds bootstrap input-group to input, with a phone icon determined by the type.

#### email

- Added `<cs-email-input>` element, wraps `<input type=email>`.
  - No functional difference to <input type=tel>`, mainly for symmetry with `<cs-phone-input>`
  - Adds input-group to input element, with an email icon addon

- Added `<cs-email-anchor>` element, wraps `<a>`


#### enum

- Added CsEnum type for describing enumerated type metadata
- Added `<cs-enum-select>` component, for selecting the value of an enumerated type
  - Wrapper for native `<select>` element. When arbitrary user inputs are allowed as a value of the enumerated
    type. An optional input can be added as a child for input of arbitrary values if the enum type supports them.

- Added angular pipe for displaying enum values

#### date

- Added `cs-date-input` for inputing dates
- Reexports `DatePipe` from @angular/forms

#### spinner

- Added `<cs-spinner>` for


### Bugfixes

#### bootstrap.dropdown

- Dropdown should not declare css overrides for bootstrap classes

#### bootstrap.modal
- Fixes to modal display state tracking

### Breaking changes

#### bootstrap.modal
    - Renamed `state` o `displayState` and `stateChange` to `displayStateChange` on `CsModalOutlet`.

#### bootstrap.dropdown
    - Removed dedicated `<cs-dropdown-menu>` component, deferring work to `cs-toggle`

#### icon
    - renamed `IconModule` to `CsIconModule` to match naming schema used elsewhere in project

## 0.0.1

### Features
- Added wrappers for some commonly used bootstrap css classes, providing integration with angular framework
- Added wrappers for font-awesome css library into the `<cs-icon>` class


