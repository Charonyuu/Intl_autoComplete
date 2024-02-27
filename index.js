const vscode = require("vscode");
const fs = require("fs");
const path = require("path"); // 确保你也引入了 path 模块

exports.activate = function (context) {
  let disposable = vscode.commands.registerCommand("extension.findKey", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      if (selectedText) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
          const workspaceRoot = workspaceFolders[0].uri.fsPath;
          // 指定相对于工作区根目录的en.json文件的路径
          const jsonFilePath = path.join(
            workspaceRoot,
            "src",
            "locales",
            "intl",
            "en.json"
          );

          // 检查en.json文件是否存在
          if (fs.existsSync(jsonFilePath)) {
            const jsonString = fs.readFileSync(jsonFilePath, "utf8");
            const jsonObject = JSON.parse(jsonString);
            const keys = Object.keys(jsonObject);
            let found = false;

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
            if (!found) {
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
