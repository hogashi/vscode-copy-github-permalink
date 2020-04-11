// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitExtension } from './git';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "myfff" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('myfff.ftoMyFf', () => {
    // The code you place here will be executed every time your command is executed

    const _gitExtension = vscode.extensions.getExtension<GitExtension>(
      'vscode.git',
    );
    if (!_gitExtension) {
      vscode.window.showInformationMessage('myfff cant get git extension');
      // return;
    }
    const gitExtension = _gitExtension!.exports;
    const git = gitExtension.getAPI(1);
    const repository = git.repositories[0];
    const fetchUrl = repository.state.remotes[0].fetchUrl;
    const httpsUrl = fetchUrl!.replace(/^(?:ssh:\/\/(?:git@|)([^:\/]+)[:\/](.+?)(?:\.git|)|(?:(?:https|git):\/\/|)(?:git@|)(.*?)(.)(?:\.git|))$/, 'https://$1$2');

    repository.getCommit('HEAD').then((commit) => {
      const activeTextEditor = vscode.window.activeTextEditor;
      let filePath = '';
      if (activeTextEditor) {
        const absolutePath = activeTextEditor.document.fileName;
        filePath = '/' + vscode.workspace.asRelativePath(absolutePath, true).split(/[\/\\]/).slice(1).join('/');
      };
      const url = `${httpsUrl}/tree/${commit.hash}${filePath}`;
      vscode.window.showInformationMessage(
        `myfff: ${url}` + ' ' + filePath,
      );
      vscode.env.clipboard.writeText(url);
    });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
