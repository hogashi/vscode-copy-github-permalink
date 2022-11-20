import * as path from 'path';
import * as vscode from 'vscode';

import { GitExtension } from './git';
import { makeHttpsUrl } from './makeHttpsUrl';

const EXTENSION_NAME = 'copy-github-permalink';

type NormalizeGitUrl = (url: string) => {
  url: string;
  branch: string;
};
const normalizeGitUrl: NormalizeGitUrl = require('normalize-git-url');
const normalize = (url: string): string =>
  makeHttpsUrl(normalizeGitUrl(url).url);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    `${EXTENSION_NAME}.activate`,
    () => {
      const _gitExtension =
        vscode.extensions.getExtension<GitExtension>('vscode.git');
      if (!_gitExtension) {
        vscode.window.showInformationMessage(
          `${EXTENSION_NAME} can't get git extension`
        );
        return;
      }
      const gitExtension = _gitExtension!.exports;
      const git = gitExtension.getAPI(1);

      // select main repo, not submodules
      // - collect submodules
      // - non-submodule repo should be main repo
      const submoduleUrls: { [key: string]: true } = {};
      git.repositories.forEach((repo) =>
        repo.state.submodules.forEach((subm) => {
          submoduleUrls[normalize(subm.url)] = true;
        })
      );

      const activeTextEditor = vscode.window.activeTextEditor;
      let filePath = '';
      if (!activeTextEditor) {
        vscode.window.showInformationMessage(
          `${EXTENSION_NAME} can't get active text editor`
        );
        return;
      }

      const absolutePath = activeTextEditor.document.fileName;
      const normalizedAbsolutePath = path.normalize(
        absolutePath.indexOf(path.sep) === 0
          ? absolutePath
          : path.sep + absolutePath
      );
      const repository = git.repositories.find((repo) => {
        const normalizedPath = path.normalize(repo.rootUri.path);
        return normalizedAbsolutePath.includes(normalizedPath);
      });
      if (!repository) {
        vscode.window.showInformationMessage(
          `${EXTENSION_NAME} can't get git repo`
        );
        return;
      }

      const fetchUrl = repository.state.remotes[0].fetchUrl;
      const httpsUrl = normalize(fetchUrl!);

      const upperPath = repository.rootUri.fsPath;
      const indexOf = absolutePath.indexOf(upperPath);
      const relativePath = absolutePath.slice(indexOf + upperPath.length);
      filePath = relativePath;

      const selection = activeTextEditor.selection;
      if (selection) {
        const start = selection.start.line + 1;
        const end = selection.end.line + 1;
        filePath += `#L${start}`;

        if (start !== end) {
          filePath += `-L${end}`;
        }
      }

      repository.getCommit('HEAD').then((commit) => {
        const treeOrBlob = filePath.length === 0 ? 'tree' : 'blob';
        const url = `${httpsUrl}/${treeOrBlob}/${commit.hash}${filePath}`;
        vscode.env.clipboard.writeText(url);
        vscode.window.showInformationMessage(`"${url}" copied`, {
          modal: false,
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  // no-op
}
