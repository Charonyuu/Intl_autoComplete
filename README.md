# intl-snippets README

## Features

### Snippets Included

![項目教學](images/demo.gif)

| Snippet  | Purpose | Description |
| ------------- | ------------- | ------------- |
| `rfm`  | intl Component  | Simplifies initializing an intl React component. |
| `ufm`  | useIntl formatMessage  | Inserts `const {formatMessage} = useIntl()` to access the formatMessage function in React components. |
| `fm`  | add formatMessage  | Inserts `formatMessage({ id: '$1' })` to simplify invoking the formatMessage function with a given message ID. |
| `fmx`  | add formatMessage in jsx {}  | Inserts `{formatMessage({ id: '$1' })}` for embedding the formatMessage function within JSX code. |

### Extension Included

This extension provides a command `extension.findKey` that performs the following steps:

1. Retrieves the selected text in the editor.
2. Checks for the presence of an `en.json` file in the directory.

```
recommand folder structure(Non-essential)
   /src
      /locales
         /intl
            /en.json
```

3. Parses the JSON file and searches for keys corresponding to the selected text.

4. If a matching key is found, it replaces the selected text with the appropriate `formatMessage` function containing the key.

5. Shows information messages in case of errors or when no key is found.

## Usage

To use the extension:

1. Open a file in Visual Studio Code.

2. Select the text you want to find a key for.

3. Run the command `Find Key` either by pressing `Ctrl+Shift+P` to open the command palette and typing `Find Key`, or by clicking `alt(option)+k` on the selected text.

4. If a matching key is found, the selected text will be replaced with the `formatMessage` function containing the key.

5. If multiple keys have the same value, a quick pick will appear for you to select the correct key.

6. You can choose whether to add the key to the `en.json` file or not using the preference option.

7. If you prefer, you can manually choose or enter the key instead of replacing it automatically.

8. The extension now trims leading and trailing whitespace from the selected text and `en.json` text when comparing.

9. To reset the preference, you can use the resetIntlPreference command in the command palette

## Known Issues

- There is a conflict with the Babel JavaScript extension. When Visual Studio Code considers the file as babel-javascript, the snippets may fail to work properly.

## Release Notes 1.0.8

- Initial release of the intl-snippets extension.
- Includes snippets for simplifying intl React component initialization and formatMessage usage.
- Added the FindKey extension.
- Allows users to find keys in an `en.json` file based on selected text and replace it with the corresponding `formatMessage` function.
- Fixed the issue that required a specific path.
- Added a quick pick for selecting the correct key when multiple keys have the same value.
- Added a preference option to choose whether to add the key to en.json or not.
- Added preference option to replace single keys with the same value or manually choose/enter the key.
- Implemented the trim() function to remove leading and trailing whitespace from the selected text and en.json text when comparing.
- You can reset the preference by using the `resetIntlPreference` command in the command palette.
- Update new logo~
