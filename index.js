const vscode = require("vscode");
const fs = require("fs");
const path = require("path"); // 确保你也引入了 path 模块

function findJsonFile(directory, fileName) {
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

          let hasJson = false;
          const currentRootFilePath = path.join(workspaceRoot, firstDirectory);
          let jsonFilePath = path.join(
            currentRootFilePath,
            "src",
            "locales",
            "intl",
            "en.json"
          );
          if (fs.existsSync(jsonFilePath)) {
            hasJson = true;
          } else {
            jsonFilePath = findJsonFile(currentRootFilePath, "en.json");
            if (jsonFilePath) {
              hasJson = true;
            }
          }
          if (hasJson) {
            const jsonString = fs.readFileSync(jsonFilePath, "utf8");
            const jsonObject = JSON.parse(jsonString);
            const keys = Object.keys(jsonObject);

            for (const key of keys) {
              const text = selectedText.trim();
              if (text.startsWith('"') && text.endsWith('"')) {
                const str = text.substring(1, text.length - 1);
                if (jsonObject[key] === str) {
                  editor.edit((editBuilder) => {
                    editBuilder.replace(
                      selection,
                      `formatMessage({ id: '${key}' })`
                    );
                  });
                  return;
                }
              }
              if (jsonObject[key] === text) {
                editor.edit((editBuilder) => {
                  editBuilder.replace(
                    selection,
                    `{formatMessage({ id: '${key}' })}`
                  );
                });
                return;
              }
            }
            vscode.window.showInformationMessage(
              `No key found for value "${selectedText}" in en.json`
            );
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
