# intl-snippets README

## Features

Snippets Included
`ufm` (useIntl formatMessage): Inserts `const {formatMessage} = useIntl()` which is used to access the formatMessage function in React components.

`fm` (add formatMessage): Inserts `formatMessage({ id: '$1' })`, simplifying the invocation of the formatMessage function with a given message ID.

`fmx` (add formatMessage in jsx {}): Inserts `{formatMessage({ id: '$1' })}`, useful for embedding the formatMessage function within JSX code.

Extension Included
This extension provides a command `extension.findKey` that performs the following steps:

1. Retrieves the selected text in the editor.
   
2. Checks for the presence of an `en.json` file in the specified directory.

3. Parses the JSON file and searches for keys corresponding to the selected text.

4. If a matching key is found, it replaces the selected text with the appropriate `formatMessage` function containing the key.

5. Shows information messages in case of errors or when no key is found.


## Usage

To use the extension:

1. Open a file in Visual Studio Code.
   
2. Select the text you want to find a key for.

3. Run the command `Find Key` either by pressing `Ctrl+Shift+P` to open the command palette and typing `Find Key`, or by clicking alt(option)+k on the selected text.

4. If a matching key is found, the selected text will be replaced with the `formatMessage` function containing the key.


## Configuration

The extension expects the following project structure:
```
root/
  src/
    locales/
      intl/
        en.json
```

## Known Issues

- The extension currently assumes a specific file structure (`en.json` located at `src/locales/intl/`). This may not be suitable for all projects and may need customization.

## Release Notes

### 1.0.0

- Initial release of the intl-snippets extension.
- Includes snippets for common formatMessage usage scenarios.
- Initial release of the FindKey extension.
- Allows users to find keys in an `en.json` file based on selected text and replace it with the corresponding `formatMessage` function.