# Changelog

## 0.3.0

### Features

#### icon
- `<cs-icon>` added input property for fixed width icons

### Bugfixes
- All input icons are fixed width

- Export `<cs-modal-outlet>` and `<cs-modal-template>` from CsModalModule
- Export `<cs-email-input>` and `<cs-email-anchor>` from CsEmailModule
- Export `<cs-enum-select>` and `CsEnumPipe` from CsEnumModule
- Export `[csIfInputError]` directive from CsBootstrapModule

### Breaking changes

#### icon
- `<cs-icon>` no longer applies classes set on the host elemen

#### phone
- `<cs-phone-input>` rewritten from scratch
- Requires `format` and `icon` inputs, rather than `type` input
- CsPhoneModule no longer exports a `PhoneLocalization` service

#### bootstrap
- Rewrite CsFormGroup component
- Remove CsIfInputError directive
- Remove 'bootstrap.scss' from src/bootstrap

#### Peer dependencies
- moment dependency upgraded to "^2.17.0"
- bootstrap dependency upgraded to "4.0.0-alpha.6"


#### Miscelaneous
- Classes and modules are now exported from index.d.ts and index.js located in the package root
    Imports from `'caesium-form/*'` should now be imported from `'caesium-form'`
-  Declare a root CaesiumFormModule which exports all the various submodules
- No longer export `*.ts` files from project

## 0.2.2

### bugfixes
#### bootstrap
- <csmodal-outlet> should not use native encapsulation or attempt to load bootstrap.css
- <cs-form-group> should not use native encapsulation or attempt to load bootstrap.css


## 0.2.1

Hotfix release, some components didn't support webpack correctly

## 0.2.0

### Features

Support for webpack module loader

### Breaking changes

#### phone
PhoneModule has been renamed to CsPhoneModule to reflect naming scheme of other modules

### Miscelaneous
- caesium-core peer dependency restricted to versions `^0.2.3`



## 0.1.0
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


