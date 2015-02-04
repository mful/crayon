# Crayon

Crayon is the basis for the Chrome extension and JS SDK, coordinating with the `notebook` repo to create the Scribble UI.

## Setup

Requires:
- `npm`
- Grunt

## Basic Code Overview

Crayon uses no third party libraries. The reason for this is that the bulk of the code is injected into every single webpage, and needs to be kept as light as possible. At some point, it may make sense to pull in all or part of a library like Underscore, as currently those utility functions are being reimplemented as needed (see `scripts/helpers/utility.js`).

Crayon is responsible for injecting existing annotations into the current page, handling user interactions with the page (highlighting text, clicking on annotated text), processing text of potential annotations, and coordinating between the different iframes responsible for pieces of the UI (see the `notebook` repo). This is primarily done through the `crayon.coordinators.WindowManager` object, to manage UI pieces (such as, if two UI windows would overlap, which should be on top?). Sending data from one iframe to another or to/from the host page itself will be handled by a background script. It may be possible to roll this coordination duty into the content script, which would likely making building the SDK a bit easier.

The fact that crayon is to be packaged both as a Chrome extension and an SDK means that we are limited in extension API usage for cross-platform features.

## Building

NOTE: Chrome extension build processes have been setup, but SDK processes have not been yet.

For dev / debugging: `grunt devBuild`
For Prod: `grunt build`

Then go to `chrome://extensions` in your browser, click `Load Unpacked Extension`, and choose the `build` directory.

## Testing

All testing is done in Jasmine, and lives under the `spec` directory. To run, type `grunt spec` in the project root. After which, you can open `_SpecRunner.html` in a browser for more detailed info.
