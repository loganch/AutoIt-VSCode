jest.mock('vscode', () => ({
  window: {
    showInformationMessage: jest.fn(),
  },
}));

jest.mock('../../src/commands/editorActions', () => jest.fn());

import debugRemove from '../../src/commands/debugRemove';
import searchAndReplace from '../../src/commands/editorActions';

const REMOVED_DEBUG_LINE_BATCH_ONE = 2;
const REMOVED_DEBUG_LINE_BATCH_TWO = 1;
const SEARCH_CALL_COUNT = 2;

describe('debugRemove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows success message when debug lines are removed', async () => {
    searchAndReplace
      .mockResolvedValueOnce(REMOVED_DEBUG_LINE_BATCH_ONE)
      .mockResolvedValueOnce(REMOVED_DEBUG_LINE_BATCH_TWO);

    await debugRemove();

    const vscode = require('vscode');
    expect(searchAndReplace).toHaveBeenCalledTimes(SEARCH_CALL_COUNT);
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
