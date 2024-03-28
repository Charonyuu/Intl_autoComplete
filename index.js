const vscode = require("vscode");
const fs = require("fs");
const path = require("path"); // 确保你也引入了 path 模块

// 遞迴查找指定目錄下的指定文件
function findJsonFile(directory, fileName) {
  let jsonFilePath = path.join(directory, "src", "locales", "intl", "en.json");
  if (fs.existsSync(jsonFilePath)) return jsonFilePath;
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const result = findJsonFile(fullPath, fileName);
      if (result) return result;
    } else if (file === fileName) {
      return fullPath;
    }
  }
  return null;
}

exports.activate = function (context) {
  let disposable = vscode.commands.registerCommand("extension.findKey", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      if (selectedText) {
        const currentFileUri = editor.document.uri;

        const workspaceFolder =
          vscode.workspace.getWorkspaceFolder(currentFileUri);
        if (workspaceFolder) {
          const workspaceRoot = workspaceFolder.uri.fsPath;
          const currentFilePath = currentFileUri.fsPath;
          // 計算當前檔案相對於工作區根目錄的相對路徑
          const relativePath = path.relative(workspaceRoot, currentFilePath);
          // 獲取 relativePath 的第一個目錄名稱，位於哪個子目錄下
          const firstDirectory = relativePath.split(path.sep)[0];
          const currentRootFilePath = path.join(workspaceRoot, firstDirectory);
          const jsonFilePath = findJsonFile(currentRootFilePath, "en.json");

          if (jsonFilePath) {
            const jsonString = fs.readFileSync(jsonFilePath, "utf8");
            const jsonObject = JSON.parse(jsonString);
            const keys = Object.keys(jsonObject);
            let match = [];
            const text = selectedText.trim();
            for (const key of keys) {
              if (text.startsWith('"') && text.endsWith('"')) {
                const str = text.substring(1, text.length - 1);
                if (jsonObject[key].trim() === str) {
                  match.push(key);
                }
              }
              if (jsonObject[key].trim() === text) {
                match.push(key);
              }
            }

            if (match.length === 1) {
              const formatMessageId = `formatMessage({ id: '${match[0]}' })`;
              const replacementText =
                text.startsWith('"') && text.endsWith('"')
                  ? formatMessageId
                  : `{${formatMessageId}}`;
              editor.edit((editBuilder) => {
                editBuilder.replace(selection, replacementText);
              });
            } else if (match.length > 1) {
              match.forEach((key) => {
                vscode.window.showInformationMessage(
                  `Multiple keys found for value "${selectedText}" in en.json: ${key}`
                );
              });
            } else {
              vscode.window.showInformationMessage(
                `No key found for value "${selectedText}" in en.json`
              );
            }
          } else {
            vscode.window.showInformationMessage(
              "en.json not found in the specified directory"
            );
          }
        }
        vscode.window.showInformationMessage(
          `No key found for value "${selectedText}" in en.json`
        );
      } else {
        vscode.window.showInformationMessage(
          "Please select some text before running this command."
        );
      }
    }
  });

  context.subscriptions.push(disposable);
};
