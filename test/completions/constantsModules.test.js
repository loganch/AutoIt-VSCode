const mockFindFilepath = jest.fn(() => '');

jest.mock('vscode', () => ({
  CompletionItemKind: {
    Function: 'function',
    Constant: 'constant',
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
    findFilepath: (...args) => mockFindFilepath(...args),
  },
}));

const resolveDefault = moduleExports => moduleExports.default ?? moduleExports;
const constantsWordModule = require('../../src/completions/constants_word.js');
const constantsButtonModule = require('../../src/completions/constants_buttonconstants.js');
const constantsTrayModule = require('../../src/completions/constants_tray.js');
const constantsUpdownModule = require('../../src/completions/constants_updown.js');
const constantsTreeviewModule = require('../../src/completions/constants_treeview.js');
const constantsAviModule = require('../../src/completions/constants_avi.js');
const constantsFrameModule = require('../../src/completions/constants_frame.js');
const constantsListboxModule = require('../../src/completions/constants_listbox.js');
const constantsFontModule = require('../../src/completions/constants_font.js');
const constantsListviewModule = require('../../src/completions/constants_listview.js');
const constantsGdiplusModule = require('../../src/completions/constants_gdiplus.js');
const constantsEditModule = require('../../src/completions/constants_edit.js');
const constantsDatetimeModule = require('../../src/completions/constants_datetime.js');
const constantsDirModule = require('../../src/completions/constants_dir.js');
const constantsComboModule = require('../../src/completions/constants_combo.js');
const constantsExcelModule = require('../../src/completions/constants_excel.js');
const constantsFileModule = require('../../src/completions/constants_file.js');
const constantsMsgboxModule = require('../../src/completions/constants_msgbox.js');
const constantsProgressModule = require('../../src/completions/constants_progress.js');
const constantsSliderModule = require('../../src/completions/constants_slider.js');
const constantsStaticModule = require('../../src/completions/constants_static.js');
const constantsStatusbarModule = require('../../src/completions/constants_statusbar.js');
const constantsStringModule = require('../../src/completions/constants_string.js');
const constantsTabModule = require('../../src/completions/constants_tab.js');
const constantsWindowsModule = require('../../src/completions/constants_windows.js');
const constantsInetModule = require('../../src/completions/constantsInet.js');

const completionModules = [
  {
    items: resolveDefault(constantsWordModule),
    name: 'constants_word',
  },
  {
    items: resolveDefault(constantsButtonModule),
    name: 'constants_buttonconstants',
  },
  {
    items: resolveDefault(constantsTrayModule),
    name: 'constants_tray',
  },
  {
    items: resolveDefault(constantsUpdownModule),
    name: 'constants_updown',
  },
  {
    items: resolveDefault(constantsTreeviewModule),
    name: 'constants_treeview',
  },
  {
    items: resolveDefault(constantsAviModule),
    name: 'constants_avi',
  },
  {
    items: resolveDefault(constantsFrameModule),
    name: 'constants_frame',
  },
  {
    items: resolveDefault(constantsListboxModule),
    name: 'constants_listbox',
  },
  {
    items: resolveDefault(constantsFontModule),
    name: 'constants_font',
  },
  {
    items: resolveDefault(constantsListviewModule),
    name: 'constants_listview',
  },
  {
    items: resolveDefault(constantsGdiplusModule),
    name: 'constants_gdiplus',
  },
  {
    items: resolveDefault(constantsEditModule),
    name: 'constants_edit',
  },
  {
    items: resolveDefault(constantsDatetimeModule),
    name: 'constants_datetime',
  },
  {
    items: resolveDefault(constantsDirModule),
    name: 'constants_dir',
  },
  {
    items: resolveDefault(constantsComboModule),
    name: 'constants_combo',
  },
  {
    items: resolveDefault(constantsExcelModule),
    name: 'constants_excel',
  },
  {
    items: resolveDefault(constantsFileModule),
    name: 'constants_file',
  },
  {
    items: resolveDefault(constantsMsgboxModule),
    name: 'constants_msgbox',
  },
  {
    items: resolveDefault(constantsProgressModule),
    name: 'constants_progress',
  },
  {
    items: resolveDefault(constantsSliderModule),
    name: 'constants_slider',
  },
  {
    items: resolveDefault(constantsStaticModule),
    name: 'constants_static',
  },
  {
    items: resolveDefault(constantsStatusbarModule),
    name: 'constants_statusbar',
  },
  {
    items: resolveDefault(constantsStringModule),
    name: 'constants_string',
  },
  {
    items: resolveDefault(constantsTabModule),
    name: 'constants_tab',
  },
  {
    items: resolveDefault(constantsWindowsModule),
    name: 'constants_windows',
  },
  {
    items: resolveDefault(constantsInetModule),
    name: 'constantsInet',
  },
];

describe('completion constant modules', () => {
  test.each(completionModules)('$name exports completion items with documentation', ({ items }) => {
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);

    const [firstItem] = items;

    expect(firstItem).toEqual(
      expect.objectContaining({
        kind: 'constant',
        detail: expect.any(String),
        label: expect.any(String),
      }),
    );
    expect(firstItem.documentation.value).toEqual(expect.any(String));
    expect(firstItem.documentation.value.length).toBeGreaterThan(0);
    expect(firstItem.commitCharacters).toEqual([]);
    expect(items.some(item => item.label.startsWith('$'))).toBe(true);
  });
});
