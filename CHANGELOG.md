# Changelog

## [Unreleased]

### Added

- `factory` (default export) creates the action creators, asynchronous action creator and reducer all at once. There's no need to call `createR` and `createAC` when using the duck pattern

### Fixed

- Instructions on `README.md` on how to use the asynchronous action creator

## [v0.2.0] - 2019-08-01

### Changed

- `createR` now accepts a reducer as the second parameter to allow customization on status handlings.

## [v0.1.0] - 2019-05-07

### Added

- `createAC` for wrapping a maybe asynchronous function with asynchronous dispatches
- `createR` for creating an reducer that'll handle the asynchronous actions for a specific name

[Unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.2.0...HEAD
[v0.2.0]: https://github.com/beblueapp/redux-async/compare/v0.1.0...v0.2.0
[v0.1.0]: https://github.com/beblueapp/redux-async/releases/tag/v0.1.0
