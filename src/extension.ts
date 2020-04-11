import * as vscode from 'vscode';
import { GitExtension } from './git';

const EXTENSION_NAME = 'copy-github-permalink';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    `${EXTENSION_NAME}.activate`,
    () => {
      const _gitExtension = vscode.extensions.getExtension<GitExtension>(
        'vscode.git',
      );
      if (!_gitExtension) {
        vscode.window.showInformationMessage(
          `${EXTENSION_NAME} can't get git extension`,
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
          submoduleUrls[subm.url] = true;
        }),
      );

      const repository = git.repositories.find((repo) => {
        const remote = repo.state.remotes.find(
          (remo) => remo.name === 'origin',
        );
        if (!(remote && remote.fetchUrl)) {
          return false;
        }
        return submoduleUrls[remote.fetchUrl] !== true;
      });
      if (!repository) {
        vscode.window.showInformationMessage(
          `${EXTENSION_NAME} can't get git repo`,
        );
        return;
      }

      const fetchUrl = repository.state.remotes[0].fetchUrl;
      const httpsUrl = fetchUrl!.replace(
        /^(?:(?:ssh|git|https):\/\/|)(?:git@|)([^:\/]+)[:\/](.+?)(?:\.git|)$/,
        'https://$1/$2',
      );

      const activeTextEditor = vscode.window.activeTextEditor;
      let filePath = '';
      if (activeTextEditor) {
        const absolutePath = activeTextEditor.document.fileName;
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
      }

      repository.getCommit('HEAD').then((commit) => {
        const url = `${httpsUrl}/tree/${commit.hash}${filePath}`;
        vscode.env.clipboard.writeText(url);
        vscode.window.showInformationMessage(`"${url}" copied`, {
          modal: false,
        });
      });
    },
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  // no-op
}
