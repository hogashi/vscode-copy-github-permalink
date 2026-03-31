# Publishing

手動で VS Code Marketplace に公開する手順。

公式ドキュメント: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

## 前提

- `@vscode/vsce` がインストールされていること（グローバルまたは `npx` 経由）
- VS Code Marketplace の Personal Access Token を取得済みであること
  - https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token

## 手順

1. `package.json` の `version` を上げてコミットする

2. `.vsix` ファイルをパッケージする

   ```sh
   vsce package
   ```

3. VS Code Marketplace に公開する

   ```sh
   vsce publish
   ```
