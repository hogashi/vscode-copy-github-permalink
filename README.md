# vscode-copy-github-permalink

Copies GitHub permalink of active file (name and line) to clipboard on VSCode.

## Features

- Open command pallete (with Cmd-Shift-P or so)
- Input to search `Copy GitHub Permalink` and select it
- Then your clipboard has a GitHub permalink generated by your workspace's git info and active file (name / line number)
  - Like this: `https://github.com/hogashi/vscode-copy-github-permalink/blob/47b96dd6cc7c521d9ab017ce7760d62536cbb4cc/src/extension.ts#L4`
  - Multiple-lined permalink will be copied if multiple lines are selected: `https://github.com/hogashi/vscode-copy-github-permalink/blob/47b96dd6cc7c521d9ab017ce7760d62536cbb4cc/src/extension.ts#L4-L6`

## Requirements

- Workspace is with git
- File is opened

## Extension Settings

- Nothing

## Release Notes

<details>

### 0.1.0

- added menu item inside editor/context, changed the title [#2](https://github.com/hogashi/vscode-copy-github-permalink/pull/2) (by @preynolds)
- dependency updates

### 0.0.7

- Fix git-remote url parsing
  - Use normalize-git-url

### 0.0.6

- Add tests for https-url maker function

### 0.0.5

- Fix git-remote url parsing
- Use `blob` when file path is in utl

### 0.0.4

- Fix url at repo has submodules

### 0.0.3

- Use simple message

### 0.0.2

- Merge CHANGELOG into README

### 0.0.1

- Initial release

</details>
