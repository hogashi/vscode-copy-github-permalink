// Unit tests for the activate function with Windows-style paths

// Mock node:path to use win32 path handling (backslash separators)
jest.mock('node:path', () => jest.requireActual<typeof import('node:path')>('node:path').win32);

// Mock dependencies first
const mockNormalizeGitUrl = jest.fn();
jest.mock('normalize-git-url', () => mockNormalizeGitUrl);

const mockMakeHttpsUrl = jest.fn();
jest.mock('../makeHttpsUrl', () => ({
  makeHttpsUrl: mockMakeHttpsUrl
}));

// Mock VS Code module
const mockCommands = {
  registerCommand: jest.fn()
};

const mockExtensions = {
  getExtension: jest.fn()
};

const mockWindow = {
  activeTextEditor: null as any,
  showInformationMessage: jest.fn()
};

const mockEnv = {
  clipboard: {
    writeText: jest.fn()
  }
};

jest.mock('vscode', () => ({
  commands: mockCommands,
  extensions: mockExtensions,
  window: mockWindow,
  env: mockEnv
}), { virtual: true });

import { activate } from '../extension';

describe('extension activate function with Windows paths', () => {
  const mockContext = {
    subscriptions: [] as any[]
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContext.subscriptions = [];
    mockNormalizeGitUrl.mockReturnValue({
      url: 'https://github.com/test/repo',
      branch: 'main'
    });
    mockMakeHttpsUrl.mockImplementation((url: string) => url);
  });

  describe('successful permalink generation with Windows file paths', () => {
    let commandCallback: Function;
    const mockRepository = {
      rootUri: { fsPath: 'C:\\test\\repo' },
      state: {
        remotes: [{ name: 'origin', fetchUrl: 'https://github.com/test/repo.git' }],
        submodules: []
      },
      getCommit: jest.fn().mockResolvedValue({ hash: 'abc123' })
    };

    const mockGitExtension = {
      exports: {
        getAPI: jest.fn().mockReturnValue({
          repositories: [mockRepository]
        })
      }
    };

    beforeEach(() => {
      mockExtensions.getExtension.mockReturnValue(mockGitExtension);
      activate(mockContext);
      commandCallback = mockCommands.registerCommand.mock.calls[0][1];
    });

    it('should generate correct URL for a file at repo root on Windows', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: 'C:\\test\\repo\\script.js' },
        selection: { start: { line: 0 }, end: { line: 0 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        'https://github.com/test/repo/blob/abc123/script.js#L1'
      );
    });

    it('should generate correct URL for a nested file on Windows (backslash -> forward slash)', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: 'C:\\test\\repo\\src\\utils\\helper.ts' },
        selection: { start: { line: 0 }, end: { line: 0 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        'https://github.com/test/repo/blob/abc123/src/utils/helper.ts#L1'
      );
    });

    it('should add ?plain=1 for markdown files on Windows', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: 'C:\\test\\repo\\README.md' },
        selection: { start: { line: 0 }, end: { line: 0 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        'https://github.com/test/repo/blob/abc123/README.md?plain=1#L1'
      );
    });

    it('should add ?plain=1 for nested markdown file on Windows', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: 'C:\\test\\repo\\docs\\guide.md' },
        selection: { start: { line: 0 }, end: { line: 0 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        'https://github.com/test/repo/blob/abc123/docs/guide.md?plain=1#L1'
      );
    });

    it('should handle multi-line selection with Windows paths', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: 'C:\\test\\repo\\src\\index.ts' },
        selection: { start: { line: 4 }, end: { line: 9 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        'https://github.com/test/repo/blob/abc123/src/index.ts#L5-L10'
      );
    });

    it('should not add ?plain=1 for .ts files on Windows', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: 'C:\\test\\repo\\src\\app.ts' },
        selection: { start: { line: 0 }, end: { line: 0 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        expect.not.stringContaining('?plain=1')
      );
    });
  });
});
