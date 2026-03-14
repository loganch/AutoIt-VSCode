jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    rm: jest.fn(),
  },
  existsSync: jest.fn(),
}));

const path = require('path');
const fs = require('fs');
const HotkeyManager = require('../../src/services/HotkeyManager');

describe('HotkeyManager', () => {
  let manager;
  let originalEnv;

  beforeEach(() => {
    jest.useFakeTimers();
    originalEnv = { ...process.env };
    fs.existsSync.mockReset();
    fs.promises.readFile.mockReset();
    fs.promises.writeFile.mockReset();
    fs.promises.rm.mockReset();
    manager = new HotkeyManager({ wrapperPath: 'C:\\AutoIt\\AutoIt3Wrapper.exe' });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    process.env = originalEnv;
  });

  it('initialises with empty active count', () => {
    expect(manager.getActiveCount()).toBe(0);
    expect(manager.config.wrapperPath).toContain('AutoIt3Wrapper.exe');
  });

  it('prefers SCITE_USERHOME for ini path when available', () => {
    process.env.SCITE_USERHOME = 'C:\\Users\\Me';
    fs.existsSync.mockImplementation(target => target.includes('C:\\Users\\Me\\AutoIt3Wrapper'));

    expect(manager._getIniPath()).toBe('C:\\Users\\Me\\AutoIt3Wrapper\\AutoIt3Wrapper.ini');
  });

  it('falls back to wrapper directory for ini path', () => {
    fs.existsSync.mockReturnValue(false);

    expect(manager._getIniPath()).toBe(
      `${path.dirname('C:\\AutoIt\\AutoIt3Wrapper.exe')}\\AutoIt3Wrapper.ini`,
    );
  });

  it('builds modified ini data with empty hotkey placeholders', async () => {
    fs.existsSync.mockReturnValue(false);
    fs.promises.readFile.mockResolvedValue(
      '[Other]\r\nSciTE_STOPEXECUTE=abc\r\nSciTE_RESTART=def\r\n',
    );

    const result = await manager._getFileData();

    expect(result.iniPath).toContain('AutoIt3Wrapper.ini');
    expect(result.iniData).toContain('[Other]');
    expect(result.iniData).toContain('SciTE_STOPEXECUTE=');
    expect(result.iniData).toContain('SciTE_RESTART=');
    expect(manager.iniDataOrig).toContain('SciTE_RESTART=def');
  });

  it('disable writes modified ini on first active process', async () => {
    fs.existsSync.mockReturnValue(false);
    fs.promises.readFile.mockResolvedValue(
      '[Other]\r\nSciTE_STOPEXECUTE=abc\r\nSciTE_RESTART=def\r\n',
    );
    fs.promises.writeFile.mockResolvedValue();

    const id = await manager.disable(7);

    expect(id).toBe(7);
    expect(manager.getActiveCount()).toBe(1);
    expect(fs.promises.writeFile).toHaveBeenCalled();
  });

  it('disable does not rewrite ini for second active process', async () => {
    fs.existsSync.mockReturnValue(false);
    fs.promises.readFile.mockResolvedValue('[Other]\r\n');
    fs.promises.writeFile.mockResolvedValue();

    await manager.disable(1);
    fs.promises.writeFile.mockClear();

    await manager.disable(2);

    expect(manager.getActiveCount()).toBe(2);
    expect(fs.promises.writeFile).not.toHaveBeenCalled();
  });

  it('reset restores original ini when last process completes', async () => {
    fs.existsSync.mockReturnValue(false);
    fs.promises.readFile.mockResolvedValue('[Other]\r\nSciTE_STOPEXECUTE=abc\r\n');
    fs.promises.writeFile.mockResolvedValue();

    await manager.disable(3);
    fs.promises.writeFile.mockClear();

    await manager.reset(3);

    expect(manager.getActiveCount()).toBe(0);
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('AutoIt3Wrapper.ini'),
      '[Other]\r\nSciTE_STOPEXECUTE=abc\r\n',
      'utf-8',
    );
  });

  it('reset removes ini when there was no original data', async () => {
    manager.iniPath = 'C:\\AutoIt\\AutoIt3Wrapper.ini';
    manager.iniDataOrig = null;

    await manager.reset();

    expect(fs.promises.rm).toHaveBeenCalledWith('C:\\AutoIt\\AutoIt3Wrapper.ini');
  });
});
