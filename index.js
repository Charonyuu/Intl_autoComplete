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

// 添加新的鍵值對到 en.json
function addToEnJson(jsonFilePath, replacementKey, text) {
  const uri = vscode.Uri.file(jsonFilePath);
  vscode.workspace.fs.readFile(uri).then(
    (fileBuffer) => {
      // 將讀取到的檔案內容解析為 JSON 對象
      const jsonContent = JSON.parse(fileBuffer.toString());

      // 添加新的鍵值對
      jsonContent[replacementKey] = text;

      // 將修改後的 JSON 對象轉換回字串格式
      const updatedContent = JSON.stringify(jsonContent, null, 2);

      // 寫回修改後的內容到 en.json 檔案
      vscode.workspace.fs
        .writeFile(uri, Buffer.from(updatedContent))
        .then(() => {
          vscode.window.showInformationMessage(
            `Added "${replacementKey}": "${text}" to en.json`
          );
        });
    },
    (error) => {
      vscode.window.showErrorMessage("Failed to read en.json");
    }
  );
}

// 提示用戶是否添加到 en.json
function promptToAddKey(context) {
  // 檢查是否已經有 'alwaysAddToEnJson' 的設置
  const alwaysAdd = context.globalState.get("alwaysAddToEnJson", false);

  if (alwaysAdd) return true;
  // 否則，詢問用戶是否添加，並提供一個 'Always Allow' 選項
  const answer = vscode.window.showInformationMessage(
    `Do you want to add the key to en.json?`,
    "Yes",
    "Always Allow",
    "No"
  );

  if (answer === "Yes" || answer === "Always Allow") {
    if (answer === "Always Allow") {
      // 如果選擇 'Always Allow'，將這個選項保存到全局狀態中
      context.globalState.update("alwaysAddToEnJson", true);
    }
    return true;
  } else {
    return false;
  }
}

// 快速替換單個鍵值對
async function quickReplaceKeyWhenSingle(context, matchLength) {
  if (matchLength > 1) return false;
  const replacePreference = context.globalState.get(
    "IntlReplacePreference",
    false
  );

  if (replacePreference === "Always Replace") return true;
  if (replacePreference === "Always Manually") return false;
  // 否則，詢問用戶是否添加，並提供一個 'Always Allow' 選項
  const answer = await vscode.window.showQuickPick(
    ["Always Replace", "Replace", "Select Manually", "Always Manually"],
    {
      placeHolder: "Quick Replace the selected text with single matched key?",
    }
  );

  if (answer === "Always Manually") {
    context.globalState.update("IntlReplacePreference", "Always Manually");
    return false;
  }
  if (answer === "Always Replace") {
    context.globalState.update("IntlReplacePreference", "Always Replace");
    return true;
  }
  if (answer === "Replace") return true;
  return false;
}

function replaceKey(key, text, selection, editor) {
  const formatMessageId = `formatMessage({ id: '${key}' })`;
  const replacementText =
    text.startsWith('"') && text.endsWith('"')
      ? formatMessageId
      : `{${formatMessageId}}`;

  editor.edit((editBuilder) => {
    editBuilder.replace(selection, replacementText);
  });
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
            if (match.length > 0) {
              quickReplaceKeyWhenSingle(context, match.length).then(
                (replace) => {
                  if (match.length === 1 && replace) {
                    replaceKey(match[0], text, selection, editor);
                  } else {
                    const pickItems = match.map((key) => ({
                      label: key,
                      description: `Replace with formatMessage({ id: '${key}' })`,
                    }));
                    pickItems.unshift({
                      label: "Click to Enter replacement manually",
                      description: "Type your own replacement",
                    });
                    vscode.window
                      .showQuickPick(pickItems, {
                        placeHolder: `keys found for "${selectedText}", select one or enter manually:`,
                      })
                      .then((selectedItem) => {
                        if (!selectedItem) {
                          return;
                        } else if (
                          selectedItem.label ===
                          "Click to Enter replacement manually"
                        ) {
                          // 如果用戶選擇手動輸入，使用 showInputBox 收集用戶輸入
                          vscode.window
                            .showInputBox({
                              prompt: "Enter your replacement key",
                            })
                            .then((replacementKey) => {
                              replaceKey(
                                replacementKey,
                                text,
                                selection,
                                editor
                              );

                              // 提示用戶是否添加到 en.json
                              const addToJson = promptToAddKey(context);
                              if (addToJson) {
                                addToEnJson(jsonFilePath, replacementKey, text);
                              }
                            });
                        } else {
                          // 如果用戶選擇了一個預定義的替換選項
                          replaceKey(
                            selectedItem.label,
                            text,
                            selection,
                            editor
                          );
                        }
                      });
                  }
                }
              );
            } else {
              vscode.window.showInformationMessage(
                `No key found for value "${selectedText}" in en.json`
              );
              return;
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
  // {
  //   "command": "extension.resetIntlReplacePreference",
  //   "title": "Reset Intl Replace Preference"
  // }
  // let resetPreferenceCommand = vscode.commands.registerCommand(
  //   "extension.resetIntlReplacePreference",
  //   () => {
  //     context.globalState.update("IntlReplacePreference", "ask").then(() => {
  //       vscode.window.showInformationMessage(
  //         "Intl replace preference has been reset to ask."
  //       );
  //     });
  //   }
  // );
  // context.subscriptions.push(resetPreferenceCommand);
  context.subscriptions.push(disposable);
};
