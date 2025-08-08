// Mock for VS Code API
module.exports = {
  commands: {
    registerCommand: jest.fn()
  },
  extensions: {
    getExtension: jest.fn()
  },
  window: {
    activeTextEditor: null,
    showInformationMessage: jest.fn()
  },
  env: {
    clipboard: {
      writeText: jest.fn()
    }
  }
};
