jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 'function',
    Constant: 'constant',
    Keyword: 'keyword',
  },
  MarkdownString: class MarkdownString {
    constructor(value = '') {
      this.value = value;
    }

    appendCodeblock(code, language) {
      this.codeblock = { code, language };
      return this;
    }
  },
  SnippetString: class SnippetString {
    constructor(value = '') {
      this.value = value;
    }

    appendText(text) {
      this.value += text;
      return this;
    }

    appendPlaceholder(text) {
      this.value += text;
      return this;
    }

    appendChoice(choices) {
      this.value += choices.join('|');
      return this;
    }
  },
  window: {
    showErrorMessage: jest.fn(),
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn(() => false),
    })),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
  },
}));

jest.mock('../../src/ai_config', () => ({
  __esModule: true,
  default: {
    findFilepath: jest.fn(() => ''),
  },
}));

const signatureModules = [
  require('../../src/signatures/udf_guictrlavi.js'),
  require('../../src/signatures/udf_sendmessage.js'),
  require('../../src/signatures/udf_clipboard.js'),
  require('../../src/signatures/udf_eventlog.js'),
  require('../../src/signatures/udf_misc.js'),
  require('../../src/signatures/WinAPIEx/WinAPIDiag.js'),
  require('../../src/signatures/WinAPIEx/WinAPICom.js'),
  require('../../src/signatures/udf_guictrltoolbar.js'),
  require('../../src/signatures/udf_guictrlstatusbar.js'),
  require('../../src/signatures/udf_guictrlmonthcal.js'),
  require('../../src/signatures/udf_guiimagelist.js'),
  require('../../src/signatures/udf_guiscrollbars.js'),
  require('../../src/signatures/udf_color.js'),
  require('../../src/signatures/udf_inet.js'),
  require('../../src/signatures/udf_security.js'),
  require('../../src/signatures/udf_guictrlrebar.js'),
  require('../../src/signatures/udf_guitooltip.js'),
  require('../../src/signatures/udf_process.js'),
  require('../../src/signatures/udf_guictrlheader.js'),
  require('../../src/signatures/udf_guictrlipaddress.js'),
  require('../../src/signatures/udf_string.js'),
  require('../../src/signatures/udf_timers.js'),
  require('../../src/signatures/udf_math.js'),
  require('../../src/signatures/udf_sound.js'),
  require('../../src/signatures/udf_ie.js'),
  require('../../src/signatures/udf_guictrlcomboboxex.js'),
  require('../../src/signatures/WinAPIEx/WinAPIMisc.js'),
  require('../../src/signatures/WinAPIEx/WinAPIDlg.js'),
  require('../../src/signatures/WinAPIEx/WinAPIShellEx.js'),
  require('../../src/signatures/WinAPIEx/WinAPIShPath.js'),
  require('../../src/signatures/WinAPIEx/WinAPITheme.js'),
  require('../../src/signatures/udf_gdiplus.js'),
  require('../../src/signatures/udf_sqlite.js'),
  require('../../src/signatures/udf_guictrlmenu.js'),
  require('../../src/signatures/udf_debug.js'),
  require('../../src/signatures/udf_array.js'),
  require('../../src/signatures/udf_guictrlbutton.js'),
  require('../../src/signatures/udf_date.js'),
  require('../../src/signatures/udf_screencapture.js'),
  require('../../src/signatures/udf_guictrltab.js'),
  require('../../src/signatures/udf_guictrledit.js'),
  require('../../src/signatures/udf_guictrllistview.js'),
  require('../../src/signatures/WinAPIEx/WinAPIGdi.js'),
  require('../../src/signatures/WinAPIEx/WinAPISys.js'),
  require('../../src/signatures/udf_winapi.js'),
  require('../../src/signatures/udf_winnet.js'),
  require('../../src/signatures/WinAPIEx/WinAPILocale.js'),
  require('../../src/signatures/udf_memory.js'),
  require('../../src/signatures/udf_guictrldtp.js'),
  require('../../src/signatures/WinAPIEx/WinAPIProc.js'),
  require('../../src/signatures/udf_guictrllistbox.js'),
  require('../../src/signatures/keywords.js'),
  require('../../src/signatures/udf_guictrltreeview.js'),
  require('../../src/signatures/udf_excel.js'),
  require('../../src/signatures/WinAPIEx/WinAPIFiles.js'),
];

describe('signature modules', () => {
  test.each(signatureModules)('exports signatures, hovers, and completions', moduleExports => {
    const { completions, default: signatures, hovers } = moduleExports;
    const [firstSignatureName] = Object.keys(signatures);

    expect(firstSignatureName).toEqual(expect.any(String));
    expect(signatures[firstSignatureName]).toEqual(
      expect.objectContaining({
        documentation: expect.any(String),
        label: expect.any(String),
      }),
    );
    expect(hovers[firstSignatureName]).toBeDefined();
    expect(Array.isArray(completions) || completions === undefined).toBe(true);

    if (Array.isArray(completions)) {
      expect(completions.length).toBeGreaterThan(0);
      expect(completions[0]).toEqual(
        expect.objectContaining({
          detail: expect.any(String),
          kind: expect.any(String),
          label: expect.any(String),
        }),
      );
    }
  });
});
