# intl-snippets README

readme ...

## Features

Snippets Included
`ufm` (useIntl formatMessage): Inserts `const {formatMessage} = useIntl()` which is used to access the formatMessage function in React components.
`fm` (add formatMessage): Inserts `formatMessage({ id: '$1' })`, simplifying the invocation of the formatMessage function with a given message ID.
`fmx` (add formatMessage in jsx {}): Inserts `{formatMessage({ id: '$1' })}`, useful for embedding the formatMessage function within JSX code.

包含的片段
ufm：插入 const {formatMessage} = useIntl()，用於在 React 組件中訪問 formatMessage 函數。
fm：插入 formatMessage({ id: '$1' })，簡化使用給定消息 ID 調用 formatMessage 函數的步驟。
fmx：插入 {formatMessage({ id: '$1' })}，方便將 formatMessage 函數嵌入到 JSX 代碼中。

Extension Included
This extension provides a command `extension.findKey` that performs the following steps:
1. Retrieves the selected text in the editor.
2. Checks for the presence of an `en.json` file in the specified directory.
3. Parses the JSON file and searches for keys corresponding to the selected text.
4. If a matching key is found, it replaces the selected text with the appropriate `formatMessage` function containing the key.
5. Shows information messages in case of errors or when no key is found.

包含的擴展
此擴展提供了一個名為 extension.findKey 的命令，執行以下步驟：
1. 獲取編輯器中的所選文本。
2. 檢查指定目錄中是否存在 en.json 文件。
3. 解析 JSON 文件並搜索與所選文本對應的鍵。
4. 如果找到匹配的鍵，則將所選文本替換為包含該鍵的適當 formatMessage 函數。
5. 在出現錯誤或找不到鍵時顯示相應的信息提示。

## Usage

To use the extension:

1. Open a file in Visual Studio Code.
2. Select the text you want to find a key for.
3. Run the command `Find Key` either by pressing `Ctrl+Shift+P` to open the command palette and typing `Find Key`, or by clicking alt(option)+k on the selected text.
4. If a matching key is found, the selected text will be replaced with the `formatMessage` function containing the key.


1. 在 Visual Studio Code 中打開文件。
2. 選擇要查找鍵的文本。
3. 通過按下 Ctrl+Shift+P 打開命令面板並輸入 Find Key，或者框選文本點擊alt(option)+k，運行命令。
4. 如果找到匹配的value，則所選文本將被替換為包含該key的 formatMessage 函數。

## Configuration

The extension expects the following project structure:
該擴展期望以下項目結構：
root/
  src/
    locales/
      intl/
        en.json
確保您的項目遵循此結構，或者修改擴展代碼以符合您的項目結構。

## Known Issues

- The extension currently assumes a specific file structure (`en.json` located at `src/locales/intl/`). This may not be suitable for all projects and may need customization.
此擴展目前假設了特定的文件結構（en.json 位於 src/locales/intl/）。這可能不適用於所有項目，可能需要進行自定義。

## Release Notes

### 1.0.0

- Initial release of the intl-snippets extension.
- Includes snippets for common formatMessage usage scenarios.
- Initial release of the FindKey extension.
- Allows users to find keys in an `en.json` file based on selected text and replace it with the corresponding `formatMessage` function.

intl-snippets 擴展的初始版本。
包含常見的 formatMessage 使用情景的片段。
FindKey 擴展的初始版本。
允許用戶根據所選文本在 en.json 文件中查找鍵，並用相應的 formatMessage 函數替換它。