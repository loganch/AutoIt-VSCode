jest.mock('vscode', () => ({
  window: {
    showInformationMessage: jest.fn(),
  },
}));

jest.mock('../../src/commands/commandUtils', () => jest.fn());

import traceRemove from '../../src/commands/trace';
import searchAndReplace from '../../src/commands/commandUtils';

const REMOVED_TRACE_LINE_COUNT = 4;

describe('traceRemove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows success message when trace lines are removed', async () => {
    searchAndReplace.mockResolvedValueOnce(REMOVED_TRACE_LINE_COUNT);

    await traceRemove();

    const vscode = require('vscode');
    expect(searchAndReplace).toHaveBeenCalledWith(expect.any(RegExp), '');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('4 trace line(s) removed.');
  });

  it('shows no-op message when no trace lines are removed', async () => {
    searchAndReplace.mockResolvedValueOnce(0);

    await traceRemove();

    const vscode = require('vscode');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('No trace lines found.');
  });
});
