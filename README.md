## UI Fixes
Current work on the UI can be found here. I do not garauntee that proper logic has been implemented for the totality of the project.

## Installation instructions
To install this Google Chrome extension, download and install Node.js [here](https://nodejs.org/en/). Once installed, open a termnial (PowerShell for Windows) and `cd` into the project directory. Run `npm install` and then `npm run build` to install all dependencies and build the extension, respectively. You can now load the extension into Chrome by navigating to Settings > Extensions > Load Unpacked, then selecting the `dist` folder.

## Testing instruction
To test this Google Chrome extension, simple run `npm test` or `npm t`. Currently there are two test sets under `test` directory: `App.test.js` and `e2e.test.js`. 
`App.test.js` does unit tests while `e2e.test.js` does end to end test. 
It also collect coverage for `src/popup/App.vue` file, but it only does for `App.test.js`.

## Status
##### *5/24/20 - 04:55pm*
Hunting bugs.

## TO-DO
  * Implement UI to delete modes
  * Implement UI to delete sites from a mode
  * Implement UI to collapse all dropdowns 
  * And so much more...

  * ~~Integrate UI and site blocking logic~~
  * ~~Implement UI to add more modes~~
  * ~~Implement UI to add more sites to a mode~~


## Status
##### *5/27/20 - 6:00am*
Paul- Worked on the bugs listed in the bug google doc. Here's a list of what was accomplished:
## Additions/Changes
  * Rudamentary delete buttons for presets and websites were added.
    * Did some very minor testing. Didn't notice any major indexing errors because of this, yet (fingers crossed).
    * They work during runtime, meaning if the app is on and a blacklisted website is deleted, you can immediately access it.
    * Deleting a preset turns the app off.
  * Changed the preset object skeleton:
    * preset.strings has been added to organize all of the major strings of a preset that aren't in openlist/blacklist.
    * preset.names was moved into preset.strings, aka preset.strings.name (watch out for merge conflicts).
    * preset.strings.openInput and preset.strings.blockInput were added.
      * openInput is synced to the openlist add button, blockInput is synced to the blacklist add button.
  * Added 'http://' concatenation for opening URL's in background.js

## Bug fixes
  * Implemented encoding method for preset names internally. Dropdowns should function with names containing any ascii characters in any order.
    * This was the result of href and URL formatting being strict on special characters.
  * The openlist and blacklist forms for each preset are now unique. Typing in the forms of one preset won't affect the other presets' forms.
  * The presets' add buttons for openlists and blacklists are now synced to their preset rather than the active preset.
  * The app will not turn on if there is no preset is active.
