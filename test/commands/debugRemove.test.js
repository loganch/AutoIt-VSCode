jest.mock('vscode', () => ({
  window: {
    showInformationMessage: jest.fn(),
  },
}));

jest.mock('../../src/commands/commandUtils', () => jest.fn());

import debugRemove from '../../src/commands/debugRemove';
import searchAndReplace from '../../src/commands/commandUtils';

describe('debugRemove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows success message when debug lines are removed', async () => {
    searchAndReplace.mockResolvedValueOnce(2).mockResolvedValueOnce(1);

    await debugRemove();

    const vscode = require('vscode');
    expect(searchAndReplace).toHaveBeenCalledTimes(2);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      '3 Debug line(s) removed successfully',
    );
  });

  it('shows no-op message when nothing is removed', async () => {
    searchAndReplace.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

    await debugRemove();

    const vscode = require('vscode');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No debug lines found');
  });
});
