# clinical_notes_chrome_extension
Chrome extension for simplifying patient clinical notes

## Testing/Running code
Put the code you would like to run in the `main()` function of `classification.ts` and then run
```
ts-node.cmd .\classification.ts
```
from cli.

Run `npm install` to ensure that you have all the necessary npm packages installed.
The package `tokenizers` requires node versions `<v14`, so ensure that you are using `node@13.14.0` along with `npm@6.14.4`.
