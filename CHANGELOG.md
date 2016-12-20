# Changelog

## 0.0.2
### Features

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

#### enum

- Added CsEnum type for describing enumerated type metadata
- Added `<cs-enum-select>` component, for selecting the value of an enumerated type
  - Wrapper for native `<select>` element. When arbitrary user inputs are allowed as a value of the enumerated
    type. An optional input can be added as a child for input of arbitrary values if the enum type supports them.




### Bugfixes

#### bootstrap.dropdown

- Dropdown should not declare css overrides for bootstrap classes

#### bootstrap.modal
- Fixes to modal display state tracking

### Breaking changes

#### bootstrap.moda
    - Renamed `state` o `displayState` and `stateChange` to `displayStateChange` on `CsModalOutlet`.

#### icon
- renamed `IconModule` to `CsIconModule` to match naming schema used elsewhere in project

## 0.0.1

### Features
- Added wrappers for some commonly used bootstrap css classes, providing integration with angular framework
- Added wrappers for font-awesome css library into the `<cs-icon>` class


