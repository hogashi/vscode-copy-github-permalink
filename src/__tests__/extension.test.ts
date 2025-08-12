// Unit tests for the activate function

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

describe('extension activate function', () => {
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

  describe('successful permalink generation with file extensions', () => {
    let commandCallback: Function;
    const mockRepository = {
      rootUri: { fsPath: '/test/repo' },
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

    it('should add ?plain=1 for markdown files', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: '/test/repo/README.md' },
        selection: { start: { line: 0 }, end: { line: 0 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('README.md?plain=1#L1')
      );
    });

    it('should not add ?plain=1 for other file types', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: '/test/repo/script.js' },
        selection: { start: { line: 0 }, end: { line: 0 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        expect.not.stringContaining('?plain=1')
      );
    });

    it('should handle single line selection correctly', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: '/test/repo/test.js' },
        selection: { start: { line: 5 }, end: { line: 5 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringMatching(/#L6$/)
      );
    });

    it('should handle multi-line selection correctly', async () => {
      mockWindow.activeTextEditor = {
        document: { fileName: '/test/repo/test.js' },
        selection: { start: { line: 5 }, end: { line: 10 } }
      };

      await commandCallback();
      await new Promise(resolve => setImmediate(resolve));

      expect(mockEnv.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('#L6-L11')
      );
    });
  });
});
